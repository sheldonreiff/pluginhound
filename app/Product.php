<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Custom\ApifyClient;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class Product extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;

    protected $primaryKey = 'sku';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if($model->calculateAggreates){
                $model->cacheProductAggregates();
            }
        });
    }

    protected $guarded = [];

    public $sendAlerts = true;
    public $calculateAggreates = true;

    protected $dispatchesEvents = [
        'saving' => \App\Events\ProductSaving::class,
    ];

    protected $dates = [
        'scraped_at',
        'sale_end',
    ];

    protected $cast = [
        'scraped_end' => 'datetime:Y-m-d',
    ];

    public function sendAlerts()
    {
        $this->sendAlerts = true;
    }

    public function dontSendAlerts()
    {
        $this->sendAlerts = false;
    }

    public function calculateAggregates()
    {
        $this->calculateAggreates = true;
    }

    public function dontCalculateAggregates()
    {
        $this->calculateAggreates = false;
    }

    public function import(string $act_id, string $run_id)
    {
        $apify = new ApifyClient();

        $run = $apify->get("acts/$act_id/runs/$run_id", [
            'format' => 'json'
        ]);

        if(!$run){
            abort(404, 'Apify run not found');
        }

        $crawler_results = $apify->get("datasets/{$run->data->defaultDatasetId}/items", [
            'format' => 'json'
        ]);

        if(!$crawler_results){
            abort(404, 'Apify dataset not found');
        }

        if($crawler_results){
            $this->transformAndSaveResults($crawler_results[0]);
        }
    }

    public function transformAndSaveResults($crawler_data, $delete=true)
    {
        if(empty($crawler_data->products)){
            throw new \ErrorException('Import payload is empty. Imported aborted.');
        }

        foreach($crawler_data->products as $product){
            Product::updateOrCreate(['sku' => $product->sku],
                [
                    'type' => $product->type,
                    'category' => $product->category,
                    'name' => $product->name,
                    'msrp' => floatval($product->msrp),
                    'sale_price' => floatval($product->salePrice),
                    'note' => $product->note,
                    'sale_end' => $product->saleEnd
                        ? Carbon::parse($product->saleEnd)->format('Y-m-d H:i:s')
                        : null,
                    'badge' => $product->badge,
                    'thumbnail_url' => $product->thumbnailUrl,
                    'scraped_at' => Carbon::parse($crawler_data->finishedAt)->format('Y-m-d H:i:s'),
                    'url' => $product->url,
                ]
            );
        }

        if($delete){
            $all_skus = array_column((array)$crawler_data->products, 'sku');

            Product::whereNotIn('sku', $all_skus)
            ->delete();
        }
    }

    public static function historicalAggregates()
    {
        $allEvents = DB::table('audits')
        ->where('auditable_type', 'App\Product')
        ->whereIn('event', ['created', 'updated'])
        ->selectRaw('*, ROW_NUMBER() OVER (PARTITION BY auditable_id ORDER BY created_at desc) as createdRank');

        $historicalOnlyEvents = DB::table( DB::raw("({$allEvents->toSql()}) as allEvents") )
        ->mergeBindings($allEvents)
        ->where('createdRank', '>', 1);

        $historicalAggregate = DB::table( DB::raw("({$historicalOnlyEvents->toSql()}) as historicalOnlyEvents") )
        ->mergeBindings($historicalOnlyEvents)
        ->groupBy('auditable_id')
        ->select(DB::raw("
            auditable_id as sku,
            avg(JSON_EXTRACT(new_values, '$.sale_price')) as average_sale_price
        "));

        return DB::table('products')
        ->whereNull('deleted_at')
        ->leftJoinSub($historicalAggregate, 'historicalAggregate', function($join) {
            $join->on('products.sku', '=', 'historicalAggregate.sku');
        })
        ->select(DB::raw("
            products.*,
            historicalAggregate.average_sale_price,
            (historicalAggregate.average_sale_price - products.sale_price) / historicalAggregate.average_sale_price as discount
        "));
    }

    public static function bestDeals()
    {
        $withRank = DB::table('products')
        ->whereNull('deleted_at')
        ->selectRaw('products.*, percent_rank() OVER (ORDER BY cached_discount) as discount_rank');

        return DB::table(DB::raw("({$withRank->toSql()}) as withRank"))
        ->mergeBindings($withRank)
        ->where('discount_rank', '>=', .9)
        ->orderBy('discount_rank', 'desc');
    }

    public function discount($fresh=false)
    {
        return $fresh || !$this->cached_discount
            ? self::historicalAggregates()
                ->where('products.sku', $this->sku)
                ->pluck('discount')
                ->first()
            : $this->cached_discount;
    }

    public function averageHistoricalSalePrice($fresh=false)
    {
        return $fresh || !$this->cached_average_sale_price
            ? self::historicalAggregates()
                ->where('products.sku', $this->sku)
                ->pluck('average_sale_price')
                ->first()
            : $this->cached_average_sale_price;
    }

    public function preSaveDiscount()
    {
        return $this->exists() && $this->sale_price !== $this->fresh()->sale_price
            ? ($this->preSaveAverageHistoricalSalePrice() - $this->sale_price) / $this->preSaveAverageHistoricalSalePrice()
            : false;
    }

    public function preSaveAverageHistoricalSalePrice()
    {
        return $this->exists() && $this->sale_price !== $this->fresh()->sale_price
            ? $this->audits()->avg('new_values->sale_price')
            : false;
    }

    public function cacheProductAggregates()
    {
        $averageHistoricalSalePrice = $this->preSaveAverageHistoricalSalePrice();
        if($averageHistoricalSalePrice !== false){
            $this->cached_average_sale_price = $averageHistoricalSalePrice;
        }

        $discount = $this->preSaveDiscount();
        if($averageHistoricalSalePrice !== false){
            $this->cached_discount = $discount;
        }
    }

    public function forceCacheProductAggregates()
    {
        $this->cached_average_sale_price = $this->averageHistoricalSalePrice(true);
        $this->cached_discount = $this->discount(true);
        $this->save();
    }

    public function exists()
    {
        return self::find($this->sku)
            ? true
            : false;
    }
}
