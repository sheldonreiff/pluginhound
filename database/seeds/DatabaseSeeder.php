<?php

use Illuminate\Database\Seeder;

use App\User;
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
        $users = factory(App\User::class, 50)
        ->make()
        ->makeVisible(['password']);

        foreach($users as $user){
            User::create(
                collect($user)
                ->except(['password_raw'])
                ->toArray()
            );
        }

        $products = factory(App\Product::class, 200)->make();

        foreach($products as $product){
            $existing = Product::find($product->sku);
            if($existing){
                $existing->fill($product->toArray());
                
                $existing->dontSendAlerts();

                $existing->save();
            }else{
                $newProduct = new Product($product->toArray());

                $newProduct->dontSendAlerts();

                $newProduct->save();
            }
        }
    }
}
