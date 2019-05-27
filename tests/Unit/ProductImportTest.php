<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Product;

class ProductImportTest extends TestCase
{
    use RefreshDatabase;

    protected $testProducts;

    public function setUp() : void
    {
        parent::setUp();

        $this->testProducts = [
            (object) [
                'sku' => 'TESTSKU1',
                'name' => 'My great product',
                'type' => 'plugin',
                'msrp' => '79.000000000',
                'salePrice' => '29.000000000',
                'category' => 'Post Production',
                'note' => 'nonsense',
                'saleEnd' => '12/3/2019 5:00:00 AM',
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png'
            ],
            (object) [
                'sku' => 'TESTSKU2',
                'name' => 'My better great product',
                'type' => 'plugin',
                'msrp' => '79.000000000',
                'salePrice' => '29.000000000',
                'category' => 'Post Production',
                'note' => null,
                'saleEnd' => null,
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png'
            ]
        ];
    }

    private function importProducts(iterable $testProductKeys)
    {
        $products = array_intersect_key($this->testProducts, array_flip($testProductKeys));

        $product = new Product();
        $product->transformAndSaveResults((object)[
            'pageFunctionFinishedAt' => (new \DateTime())->format(\DateTime::ATOM),
            'pageFunctionResult' => $products
        ]);
    }

    public function test_products_can_be_imported()
    {
        $this->importProducts([0, 1]);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts[0]->sku,
            'sale_price' => $this->testProducts[0]->salePrice,
            'thumbnail_url' => $this->testProducts[0]->thumbnailUrl
        ]);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts[1]->sku,
            'sale_price' => $this->testProducts[1]->salePrice,
            'thumbnail_url' => $this->testProducts[1]->thumbnailUrl
        ]);
    }

    public function test_missing_products_are_deleted()
    {
        $this->importProducts([0]);

        $this->assertDatabaseHas('products', [
            'sku' => $this->testProducts[0]->sku,
            'sale_price' => $this->testProducts[0]->salePrice,
            'thumbnail_url' => $this->testProducts[0]->thumbnailUrl
        ]);

        $this->assertDatabaseMissing('products', [
            'sku' => $this->testProducts[1]->sku,
            'sale_price' => $this->testProducts[1]->salePrice,
            'thumbnail_url' => $this->testProducts[1]->thumbnailUrl
        ]);
    }
}
