<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('event', 100);
            $table->string('threshold_unit', 100)->nullable();
            $table->float('threshold_value')->nullable();
            $table->string('alert_method', 100);
            $table->string('product_sku', 50);
            $table->timestamps();

            $table->unique(['user_id', 'event', 'threshold_unit', 'threshold_value', 'alert_method', 'product_sku'], 'uk_alerts');

            $table->foreign('user_id')
            ->references('id')->on('users')
            ->onDelete('cascade');

            $table->foreign('product_sku')
            ->references('sku')->on('products')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alerts');
    }
}
