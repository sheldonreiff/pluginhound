<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Custom\ApifyClient;
use OwenIt\Auditing\Contracts\Auditable;

use Illuminate\Support\Facades\DB;

class Product extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

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
        'scraped_date' => 'datetime:Y-m-d'
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

    public static function transformAndSaveResults($crawler_data)
    {
        foreach($crawler_data->pageFunctionResult as $product){
            Product::updateOrCreate(['sku' => $product->sku],
                [
                    'type' => $product->type,
                    'category' => $product->category,
                    'name' => $product->name,
                    'msrp' => floatval($product->msrp),
                    'sale_price' => floatval($product->salePrice),
                    'note' => $product->note,
                    'sale_end' => date('Y-m-d H:i:s', strtotime($product->saleEnd)),
                    'badge' => $product->badge,
                    'thumbnail_url' => $product->thumbnailUrl,
                    'scraped_date' => date('Y-m-d', strtotime($crawler_data->pageFunctionFinishedAt)), # for display and aggregation purposes, only care about date
                    'scraped_at' => date('Y-m-d H:i:s', strtotime($crawler_data->pageFunctionFinishedAt)),
                    'url' => $product->url,
                ]
            );
        }

        $all_skus = array_column((array)$crawler_data->pageFunctionResult, 'sku');

        Product::whereNotIn('sku', $all_skus);
    }

    public static function comparisons()
    {
        $history = \OwenIt\Auditing\Models\Audit::where('auditable_type', 'App\Product')
        ->groupBy('auditable_id')
        ->select(DB::raw("
            auditable_id as sku,
            avg(JSON_EXTRACT(new_values, '$.sale_price')) as average_sale_price
        "));

        return DB::table('products')
        ->joinSub($history, 'history', function($join){
            $join->on('products.sku', '=', 'history.sku');
        })
        ->select(DB::raw("products.*, history.average_sale_price, (history.average_sale_price - products.sale_price) / history.average_sale_price as discount"));
    }

    public static function bestDeals()
    {
        $comparisons = self::comparisons();
        
        $withRank = DB::table( DB::raw("({$comparisons->toSql()}) as sub") )
        ->mergeBindings($comparisons)
        ->select(DB::raw('sub.*, percent_rank() OVER (ORDER BY discount) as discount_rank'));

        return DB::table(DB::raw("({$withRank->toSql()}) as sub"))
        ->mergeBindings($withRank)
        ->where('discount_rank', '>=', .5)
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
