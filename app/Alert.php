<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{

    protected $guarded = ['user_id'];

    /**
     * Event types
     */
    const DECREASE_BY = 'decrease_by';
    const ANY_CHANGE = 'any_change';
    const LESS_THAN = 'less_than';
    /**
     * Threshold unit types
     */
    const PERCENT = 'percent';
    const CURRENCY = 'currency';
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function product()
    {
        return $this->belongsTo('App\Product');
    }
}
