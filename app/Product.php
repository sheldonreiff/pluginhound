<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Custom\ApifyClient;
use OwenIt\Auditing\Contracts\Auditable;

class Product extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $primaryKey = 'sku';

    protected $guarded = [];

    public function import(string $exec_id)
    {
        $apify = new ApifyClient();

        $crawler_results = $apify->get("execs/$exec_id/results", [
            'format' => 'json',
            'limit' => 100000
        ]);

        if($crawler_results){
            $this->transformAndSaveResults($crawler_results[0]);
        }
    }

    public function transformAndSaveResults(object $crawler_data)
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
                    'scraped_at' => date('Y-m-d H:i:s', strtotime($crawler_data->pageFunctionFinishedAt)),
                ]
            );
        }

        $all_skus = array_column((array)$crawler_data->pageFunctionResult, 'sku');

        Product::whereNotIn('sku', $all_skus);
    }
}
