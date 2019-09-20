<?php

namespace App\Http\Resources;

use Illuminate\Support\Carbon;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductHistory extends JsonResource
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
            'sale_price' => !empty($this['sale_price']['new'])
                ? $this['sale_price']['new']
                : null,
            'msrp' => !empty($this['msrp']['new'])
                ? $this['msrp']['new']
                : null,
            'date' => !empty($this['scraped_at']['new'])
                ? Carbon::parse($this['scraped_at']['new'])->format('Y-m-d')
                : null,
        ];
    }
}
