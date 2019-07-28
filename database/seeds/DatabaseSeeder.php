<?php

use Illuminate\Database\Seeder;

use App\Product;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 50)->create();

        $products = factory(App\Product::class, 200)->make();

        foreach($products as $product){
            $existing = Product::find($product->sku);
            if($existing){
                $existing->update($product->toArray());
            }else{
                Product::create($product->toArray());
            }
        }
    }
}
