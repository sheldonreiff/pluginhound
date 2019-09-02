<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Product;

class ProductImportTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function products_can_be_imported()
    {
        $this->importProducts(['a', 'b']);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts['a']->sku,
            'sale_price' => $this->testProducts['a']->salePrice,
            'thumbnail_url' => $this->testProducts['a']->thumbnailUrl
        ]);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts['b']->sku,
            'sale_price' => $this->testProducts['b']->salePrice,
            'thumbnail_url' => $this->testProducts['b']->thumbnailUrl
        ]);
    }

    /** @test */
    public function missing_products_are_deleted()
    {
        $this->importProducts(['a', 'b']);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts['a']->sku,
            'sale_price' => $this->testProducts['a']->salePrice,
            'thumbnail_url' => $this->testProducts['a']->thumbnailUrl
        ]);

        $this->importProducts(['a']);

        $this->assertDatabaseMissing('products', [
            'sku' => $this->testProducts['b']->sku,
            'sale_price' => $this->testProducts['b']->salePrice,
            'thumbnail_url' => $this->testProducts['b']->thumbnailUrl
        ]);
    }

    /** @test */
    public function product_history_is_recorded()
    {
        $this->importProducts(['a', 'a_decreased']);

        $this->assertDatabaseHas('audits', [
            'auditable_type' => 'App\Product',
            'auditable_id' => $this->testProducts['a']->sku,
            'event' => 'updated',
        ]);
    }
}
