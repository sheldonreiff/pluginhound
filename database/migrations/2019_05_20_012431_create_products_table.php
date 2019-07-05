<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('sku', 50);
            $table->string('name', 250);
            $table->enum('type', ['plugin', 'bundle']);
            $table->float('msrp', 10, 2)->nullable();
            $table->float('sale_price', 10, 2)->nullable();
            $table->string('category', 50)->nullable();
            $table->string('note', 250)->nullable();
            $table->date('sale_end')->nullable();
            $table->string('badge', 50)->nullable();
            $table->string('thumbnail_url', 300)->nullable();
            $table->date('scraped_date');
            $table->dateTime('scraped_at');
            $table->timestamps();

            $table->primary('sku');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
