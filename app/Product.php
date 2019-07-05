<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Custom\ApifyClient;
use OwenIt\Auditing\Contracts\Auditable;

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
}
