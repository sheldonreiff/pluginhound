<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{

    protected $guarded = ['user_id'];
    
    public function users()
    {
        return $this->belongsTo('App\User');
    }
}
