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

    public function import(string $act_id, string $run_id)
    {
        $apify = new ApifyClient();

        $run = $apify->get("acts/$act_id/runs/$run_id", [
            'format' => 'json'
        ]);

        $crawler_results = $apify->get("datasets/{$run->data->defaultDatasetId}/items", [
            'format' => 'json'
        ]);

        if($crawler_results){
            $this->transformAndSaveResults($crawler_results[0]);
        }
    }

    public function transformAndSaveResults($crawler_data)
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
        ->select(DB::raw('products.*, history.average_sale_price, (history.average_sale_price - products.sale_price) / history.average_sale_price as discount'));
    }

    public static function bestDeals()
    {
        return self::comparisons()
        ->whereRaw('(history.average_sale_price - products.sale_price) / history.average_sale_price > .2');
    }

    public function averageSalePrice()
    {
        return $this->audits->avg('new_values->sale_price');
    }
}
