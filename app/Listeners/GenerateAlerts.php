<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Alert;
use App\Notifications\Alert as AlertNotification;

use App\Product;
use App\User;
use Illuminate\Support\Facades\Gate;

class GenerateAlerts implements ShouldQueue
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {

    }

    private function triggeredAlerts($query, $event, $changes)
    {
        return $query->where('product_sku', $event->product->sku)
        ->where(function ($query) use($changes) {
            $query->where(function($query) use($changes) {
                $query->where('event', Alert::LESS_THAN)
                ->where('threshold_unit', Alert::PERCENT)
                ->where('threshold_value', '<=', $changes->get('percent_change') * -1);
            })
            ->orWhere(function($query) use($changes) {
                $query->where('event', Alert::LESS_THAN)
                ->where('threshold_unit', Alert::CURRENCY)
                ->where('threshold_value', '<=', $changes->get('currency_change') * -1);
            })
            ->orWhere(function($query) {
                $query->where('event', Alert::LESS_THAN_ABSOLUTE)
                ->where('threshold_value', '<=', $event->product->sale_price);
            })
            ->orWhere(function($query) {
                $query->where('event', Alert::ANY_CHANGE);
            });
        });
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        if($event->priceChanged && $event->alertsEnabled){
            $changes = collect([
                'percent_change' => $event->product->sale_price
                    ? (($event->product->sale_price - $event->oldSalePrice ) / $event->product->sale_price) * 100
                    : 100,
                'currency_change' => $event->product->sale_price - $event->oldSalePrice,
                'any_change' => true,
            ]);
        
            $usersToAlert = User::with(['alerts' => function($query)  use($event, $changes) {
                return $this->triggeredAlerts($query, $event, $changes);
            }])
            ->whereHas('alerts', function($query) use($event, $changes) {
                return $this->triggeredAlerts($query, $event, $changes);
            });
            
            $usersToAlert->each(function ($user, $key) use($event, $changes) {
                if(Gate::forUser($user)->allows('send-alert')){
                    $user->notify(new AlertNotification($event->product, $changes, $user->alerts));
                }
            });
        }
    }
}
