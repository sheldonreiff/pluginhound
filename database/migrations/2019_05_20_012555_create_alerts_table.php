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
            $table->enum('event', ['less_than', 'any_change']);
            $table->enum('threshold_unit', ['percent', 'currency'])->nullable();
            $table->float('threshold_value')->nullable();
            $table->enum('alert_method', ['email']);
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
