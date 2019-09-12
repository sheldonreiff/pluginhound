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
                'type' => $this->testProducts['a']->type,
                'msrp' => $this->testProducts['a']->msrp,
                'sale_price' => $this->testProducts['a']->salePrice,
                'category' => $this->testProducts['a']->category,
                'note' => $this->testProducts['a']->note,
                'sale_end' => $this->dateTimeToDate($this->testProducts['a']->saleEnd),
                'badge' => $this->testProducts['a']->badge,
                'thumbnail_url' => $this->testProducts['a']->thumbnailUrl,
                'url' => $this->testProducts['a']->url,
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
                    'date' => $this->dateTimeToDate($import['changed']->pageFunctionFinishedAt),
                    'sale_price' => intval($this->testProducts['a']->salePrice),
                ],
            ]
        ]);
    }

    /** @test */
    public function best_deals_filter_returns_only_best_deals()
    {
        $import = $this->importProducts();

        $this->json('GET', 'api/products', [
            'bestDeals' => 'true',
            'page' => 1,
            'perPage' => 12,
        ])
        ->assertJson([
            'data' => [
                [
                    'sku' => $this->testProducts['a_decreased']->sku,
                    'name' => $this->testProducts['a_decreased']->name,
                    'type' => $this->testProducts['a_decreased']->type,
                    'msrp' => $this->testProducts['a_decreased']->msrp,
                    'sale_price' => $this->testProducts['a_decreased']->salePrice,
                    'category' => $this->testProducts['a_decreased']->category,
                    'note' => $this->testProducts['a_decreased']->note,
                    'sale_end' => $this->dateTimeToDate($this->testProducts['a_decreased']->saleEnd),
                    'badge' => $this->testProducts['a_decreased']->badge,
                    'thumbnail_url' => $this->testProducts['a_decreased']->thumbnailUrl,
                    'url' => $this->testProducts['a_decreased']->url,
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

        $this->json('GET', 'api/products', [
            'bestDeals' => 'false',
            'page' => 1,
            'perPage' => 12,
        ])
        ->assertJson([
            'data' => [
                [
                    'sku' => $this->testProducts['a_decreased']->sku,
                    'name' => $this->testProducts['a_decreased']->name,
                    'type' => $this->testProducts['a_decreased']->type,
                    'msrp' => $this->testProducts['a_decreased']->msrp,
                    'sale_price' => $this->testProducts['a_decreased']->salePrice,
                    'category' => $this->testProducts['a_decreased']->category,
                    'note' => $this->testProducts['a_decreased']->note,
                    'sale_end' => $this->dateTimeToDate($this->testProducts['a_decreased']->saleEnd),
                    'badge' => $this->testProducts['a_decreased']->badge,
                    'thumbnail_url' => $this->testProducts['a_decreased']->thumbnailUrl,
                    'url' => $this->testProducts['a_decreased']->url,
                ],
                [
                    'sku' => $this->testProducts['b_decreased']->sku,
                    'name' => $this->testProducts['b_decreased']->name,
                    'type' => $this->testProducts['b_decreased']->type,
                    'msrp' => $this->testProducts['b_decreased']->msrp,
                    'sale_price' => $this->testProducts['b_decreased']->salePrice,
                    'category' => $this->testProducts['b_decreased']->category,
                    'note' => $this->testProducts['b_decreased']->note,
                    'sale_end' => $this->dateTimeToDate($this->testProducts['b_decreased']->saleEnd),
                    'badge' => $this->testProducts['b_decreased']->badge,
                    'thumbnail_url' => $this->testProducts['b_decreased']->thumbnailUrl,
                    'url' => $this->testProducts['b_decreased']->url,
                ],
            ]
        ]);
    }

    /** @test */
    public function calculates_product_discount_correctly()
    {
        $import = $this->importProducts();

        $this->json('GET', 'api/products', [
            'bestDeals' => 'false',
            'page' => 1,
            'perPage' => 12,
        ])
        ->assertJson([
            'data' => [
                [
                    'sku' => $this->testProducts['a_decreased']->sku,
                    'msrp' => $this->testProducts['a_decreased']->msrp,
                    'sale_price' => $this->testProducts['a_decreased']->salePrice,
                    'discount' => ($this->testProducts['a']->salePrice - $this->testProducts['a_decreased']->salePrice) / $this->testProducts['a']->salePrice
                ],
            ]
        ]);
    }
}
