<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('mailable', function () {
//     $product = App\Product::first();
//     $changes = collect([
//         'percent_change' => 50,
//         'currency_change' => 25,
//         'any_change' => true,
//     ]);
//     $alerts = [
//         \App\Alert::first(),
//     ];

//     return new App\Mail\Alert($product, $changes, $alerts);
// });

Route::get('{path}', function () {
    return view('home');
})->where('path', '^((?!api)[\s\S])*$');

// only for password reset email, not actual laravel route
Route::get('/reset', null)
->name('password.reset');
