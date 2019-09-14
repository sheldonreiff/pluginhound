<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('jwt.auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'throttle:60,1',
], function ($router) {

    /**
     * Auth
     */
    Route::post('auth/login', 'Auth\AuthController@login');
    Route::post('auth/register', 'UserController@store');

    Route::group([
        'middleware' => 'jwt.auth'
    ], function ($router) {

        /**
         * Auth
         */
        Route::post('auth/logout', 'Auth\AuthController@logout');
        Route::post('auth/refresh', 'Auth\AuthController@refresh');
        Route::get('auth/validate', 'Auth\AuthController@validate');
    
        /**
         * Password
         */
        Route::post('password/update', 'UserController@update');

        /**
         * Alerts
         */
        Route::get('product/{product}/alerts', 'AlertController@index');
        Route::post('product/{product}/alert', 'AlertController@store');
        Route::get('alert/{alert}', 'AlertController@show');
        Route::patch('alert/{alert}', 'AlertController@update');
        Route::delete('alert/{alert}', 'AlertController@destroy');
        Route::get('alerts', 'AlertController@index');

        /**
         * Email verify
         */
        Route::post('email/resend', 'Auth\VerificationController@resend')->name('verification.resend')->middleware('jwt.auth');

        /**
         * Me
         */
        Route::get('me', 'Auth\AuthController@me');
        Route::patch('me', 'UserController@update');
    });

    Route::group([
        'middleware' => 'signed'
    ], function ($router) {
        /**
         * Email verify
         */
        Route::get('email/verify', 'Auth\VerificationController@show')->name('verification.notice');
        Route::get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify');
    });

    /**
     * Register
     */
    Route::post('user/register', 'UserController@store');

    /**
     * Password
     */
    Route::post('password/send', 'Auth\ResetPasswordController@sendPasswordReset');

    /**
     * Products
     */
    Route::get('product/{product}', 'ProductController@show');
    Route::get('product/{product}/history', 'ProductController@history');
    Route::get('products', 'ProductController@index');

    Route::post('password/reset', 'Auth\ResetPasswordController@reset');
});

Route::group([
    'middleware' => 'webhook'
], function ($router) {
    Route::post('products', 'ProductController@store');
});
