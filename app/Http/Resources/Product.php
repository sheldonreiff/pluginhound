<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class Product extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'badge' => $this->badge,
            'category' => $this->category,
            'msrp' => $this->msrp,
            'name' => $this->name,
            'note' => $this->note,
            'sale_end' => $this->sale_end
                ? Carbon::parse($this->sale_end)->format('Y-m-d')
                : null,
            'sale_price' => $this->sale_price,
            'scraped_date' => $this->scraped_date
                ? Carbon::parse($this->scraped_date)->format('Y-m-d')
                : null,
            'sku' => $this->sku,
            'thumbnail_url' => $this->thumbnail_url,
            'type' => $this->type,

            'url' => $this->url,
            'discount' => $this->cached_discount,
            'average_sale_price' => $this->cached_average_sale_price,
        ];
    }
}
