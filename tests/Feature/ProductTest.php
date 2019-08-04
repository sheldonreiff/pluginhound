<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_get_product()
    {
        $this->importProducts(['a']);

        $this->get("/api/product/{$this->testProducts['a']->sku}")
        ->assertJson([
            'data' => [
                'sku' => $this->testProducts['a']->sku,
                'name' => $this->testProducts['a']->name,
                'sale_price' => $this->testProducts['a']->salePrice,
                'thumbnail_url' => $this->testProducts['a']->thumbnailUrl,
            ],
        ]);
    }

    /** @test */
    public function can_get_product_history()
    {
        $import = $this->importProducts();

        $this->get("/api/product/{$this->testProducts['a_decreased']->sku}/history")
        ->assertJson([
            'data' => [
                [
                    'sale_price' => intval($this->testProducts['a_decreased']->salePrice),
                ],
                [
                    'date' => date('Y-m-d', strtotime($import->pageFunctionFinishedAt)),
                    'sale_price' => intval($this->testProducts['a']->salePrice),
                ],
            ]
        ]);
    }

    /** @test */
    public function best_deals_filter_returns_only_best_deals()
    {
        $import = $this->importProducts();

        $this->get("api/products?bestDeals=true")
        ->assertJson([
            'data' => [
                [
                    'sku' => $this->testProducts['a_decreased']->sku,
                    'sale_price' => $this->testProducts['a_decreased']->salePrice,
                ],
            ]
        ])
        ->assertJsonMissing([
            'data' => [
                [
                    'sku' => $this->testProducts['b_decreased']->sku,
                    'sale_price' => $this->testProducts['b_decreased']->salePrice,
                ],
            ]
        ]);
    }

    /** @test */
    public function products_returns_all_products()
    {
        $import = $this->importProducts();

        $this->get("api/products?bestDeals=false")
        ->assertJson([
            'data' => [
                [
                    'sku' => $this->testProducts['a_decreased']->sku,
                    'sale_price' => $this->testProducts['a_decreased']->salePrice,
                ],
            ]
        ])
        ->assertJsonMissing([
            'data' => [
                [
                    'sku' => $this->testProducts['b_decreased']->sku,
                    'sale_price' => $this->testProducts['b_decreased']->salePrice,
                ],
            ]
        ]);
    }
}
