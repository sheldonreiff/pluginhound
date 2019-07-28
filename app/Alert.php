<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{

    protected $guarded = ['user_id'];

    /**
     * Event types
     */
    const LESS_THAN = 'less_than';
    const ANY_CHANGE = 'any_change';
    /**
     * Threshold unit types
     */
    const PERCENT = 'percent';
    const CURRENCY = 'currenct';
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function product()
    {
        return $this->belongsTo('App\Product');
    }
}
