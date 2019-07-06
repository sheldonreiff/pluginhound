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
    'prefix' => 'auth'
], function ($router) {

    Route::post('login', 'Auth\AuthController@login');
    Route::post('logout', 'Auth\AuthController@logout');
    Route::post('refresh', 'Auth\AuthController@refresh');
    Route::get('me', 'Auth\AuthController@me');
    Route::post('register', 'UserController@store');

});

Route::group([
    'middleware' => 'jwt.auth',
    'prefix' => 'password'
], function ($router) {

    Route::post('update', 'UserController@updatePassword');
    Route::post('reset', 'ResetPasswordController@resetPassword');

});

Route::patch('me', 'UserController@update');

Route::get('email/verify', 'Auth\VerificationController@show')->name('verification.notice')->middleware('signed');;
Route::get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify')->middleware('signed');
Route::post('email/resend', 'Auth\VerificationController@resend')->name('verification.resend')->middleware('jwt.auth');

Route::get('product/{product}', 'ProductController@show');
Route::get('product/{product}/history', 'ProductController@history');
Route::get('products', 'ProductController@index');


Route::post('product/{product}/alert', 'AlertContoller@store');
Route::patch('product/{product}/alert/{alert}', 'AlertContoller@update');

Route::post('user/register', 'UserController@store');