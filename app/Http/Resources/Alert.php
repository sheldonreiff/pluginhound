<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

use App\Http\Resources\Product as ProductResource;

class Alert extends JsonResource
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
            'id' => $this->id,
            'alert_method' => $this->alert_method,
            'event' => $this->event,
            'product_sku' => $this->product_sku,
            'threshold_unit' => $this->threshold_unit,
            'threshold_value' => $this->threshold_value,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
