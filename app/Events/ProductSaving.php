<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\Product;

class ProductSaving
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $priceChanged;
    public $alertsEnabled;
    public $oldSalePrice;
    public $product;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Product $product)
    {
        $this->priceChanged = $product->exists() && $product->isDirty('sale_price');
        $this->alertsEnabled = $product->sendAlerts;
        $this->oldSalePrice = $product->getOriginal('sale_price');

        $this->product = (object)$product->getAttributes();
    }
}
