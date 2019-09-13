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

    protected $guarded = [];

    public $sendAlerts = true;

    protected $dispatchesEvents = [
        'saving' => \App\Events\ProductSaving::class,
    ];

    protected $dates = [
        'scraped_at',
        'scraped_date',
        'sale_end',
    ];

    protected $auditExclude = [
        'scraped_at',
    ];

    protected $cast = [
        'scraped_date' => 'datetime:Y-m-d',
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
                    'scraped_date' => Carbon::parse($crawler_data->finishedAt)->format('Y-m-d'), # for display and aggregation purposes, only care about date
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

    public static function comparisons()
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
        ->leftJoinSub($historicalAggregate, 'historicalAggregate', function($join){
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
        $comparisons = self::comparisons();
        
        $withRank = DB::table( DB::raw("({$comparisons->toSql()}) as withRank") )
        ->mergeBindings($comparisons)
        ->select(DB::raw('withRank.*, percent_rank() OVER (ORDER BY discount) as discount_rank'));

        return DB::table(DB::raw("({$withRank->toSql()}) as withRank"))
        ->mergeBindings($withRank)
        ->where('discount_rank', '>=', .9)
        ->orderBy('discount_rank', 'desc');
    }

    public function discount(){
        return self::comparisons()
        ->where('products.sku', $this->sku)
        ->pluck('discount')
        ->first();
    }

    public function averageSalePrice()
    {
        return $this->audits->avg('new_values->sale_price');
    }
}
