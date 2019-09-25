<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Product;

class Alert extends Mailable
{
    use Queueable, SerializesModels;

    protected $product;
    protected $changes;
    protected $alerts;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(object $product, $changes, $alerts)
    {
        $this->product = $product;
        $this->changes = $changes;
        $this->alerts = $alerts;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $currencyChange = abs($this->changes->get('currency_change'));
        $percentChange = abs(round($this->changes->get('percent_change')));
        $decrease = $this->changes->get('currency_change') < 0;

        $changeLanguage = $decrease ? 'down' : 'up';

        return $this->subject("Price Changed! - {$this->product->name} -  $changeLanguage $currencyChange ($percentChange%)")
        ->markdown('mail.product_alert', [
            'product' => $this->product,
            'currencyChange' => $currencyChange,
            'percentChange' => $percentChange,
            'decrease' => $decrease,
            'alerts' => $this->alerts,
            'productUrl' => config('app.url')."/product/{$this->product->sku}",
        ]);
    }
}
