<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Product;
use Faker\Generator as Faker;

$factory->define(Product::class, function (Faker $faker) {
    return [
        'sku' => $faker->randomElement(['abc', 'abcd', 'abcde', 'abcdef']),
        'badge' => $faker->randomElement(['New', 'Super Deal', 'Top Seller', null]),
        'category' => $faker->randomElement(['Reverb', 'Vocals', 'Modeling', 'Effects', null]),
        'msrp' => $faker->randomFloat(2, 20, 10000),
        'sale_price' => $faker->randomFloat(2, 20, 10000),
        'name' => $faker->text(50),
        'note' => $faker->randomElement(['select_bundles', 'free', null]),
        'sale_end' => $faker->dateTimeThisYear(),
        'scraped_at' => $faker->dateTimeThisYear(),
        'thumbnail_url' => $faker->imageUrl(100, 100, 'cats'),
        'type' => $faker->randomElement(['plugin', 'bundle']),
    ];
});
