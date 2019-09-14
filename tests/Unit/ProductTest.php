<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function calculates_discount_correctly()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');

        $this->assertEquals(
            ($this->testProducts['a']->salePrice - $this->testProducts['a_decreased']->salePrice) / $this->testProducts['a']->salePrice,
            $product->cached_discount,
            '',
            0.1
        );
    }

    /** @test */
    public function calculates_average_historical_price_correctly()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');

        $this->assertEquals(
            $this->testProducts['a']->salePrice,
            $product->cached_average_sale_price
        );
    }

    /** @test */
    public function calculates_fresh_discount_correctly()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');
        $originalDiscount = $product->cached_discount;
        $product->forceCacheProductAggregates();

        $this->assertEquals(
            $originalDiscount,
            $product->fresh()->cached_discount
        );
    }

    /** @test */
    public function calculates_fresh_average_historical_price_correctly()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');
        $originalAverageHistoricalDiscount = $product->cached_average_sale_price;
        $product->forceCacheProductAggregates();

        $this->assertEquals(
            $originalAverageHistoricalDiscount,
            $product->fresh()->cached_average_sale_price
        );
    }

    /** @test */
    public function cached_discount_and_fresh_are_the_same()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');

        $this->assertEquals(
            $product->discount(),
            $product->discount(true)
        );
    }

    /** @test */
    public function cached_average_historical_price_and_fresh_are_the_same()
    {
        $import = $this->importProducts();

        $product = $this->getTestProduct('a');

        $this->assertEquals(
            $product->averageHistoricalSalePrice(),
            $product->averageHistoricalSalePrice(true)
        );
    }
}
