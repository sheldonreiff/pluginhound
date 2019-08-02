<?php

namespace Tests;

use App\Product;
use App\User;
use Tymon\JWTAuth\Facades\JWTAuth;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected $testProducts;
    protected $testAlerts;
    protected $user;
    protected $faker;

    public function be(User $user, $driver = null)
    {
        $token = JWTAuth::fromUser($user);
        $this->withHeader('Authorization', 'Bearer ' . $token);

        return $this;
    }

    public function setUp() : void
    {
        parent::setUp();

        $this->userData = factory(User::class)
        ->make()
        ->makeVisible(['password']);

        $this->user = User::create($this->userData->toArray());

        $this->be($this->user);

        $this->testProducts = [
            'a' => (object) [
                'sku' => 'TESTSKU1',
                'name' => 'My great product',
                'type' => 'plugin',
                'msrp' => '79.000000000',
                'salePrice' => '49.000000000',
                'category' => 'Post Production',
                'note' => 'nonsense',
                'saleEnd' => '12/3/2019 5:00:00 AM',
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png',
            ],
            'b' => (object) [
                'sku' => 'TESTSKU2',
                'name' => 'My better great product',
                'type' => 'plugin',
                'msrp' => '79.000000000',
                'salePrice' => '79.000000000',
                'category' => 'Post Production',
                'note' => null,
                'saleEnd' => null,
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png'
            ],
            'a_decreased' => (object) [
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
            'b_decreased' => (object) [
                'sku' => 'TESTSKU2',
                'name' => 'My better great product',
                'type' => 'plugin',
                'msrp' => '69.000000000',
                'salePrice' => '69.000000000',
                'category' => 'Post Production',
                'note' => null,
                'saleEnd' => null,
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png'
            ],
        ];

        $this->testAlerts = [
            'a' => [
                'event' => 'less_than',
                'threshold_unit' => 'percent',
                'threshold_value' => 20,
                'alert_method' => 'email',
                'product_sku' => $this->testProducts['a']->sku,
            ],
            'b' => [
                'event' => 'less_than',
                'threshold_unit' => 'percent',
                'threshold_value' => 20,
                'alert_method' => 'email',
                'product_sku' => $this->testProducts['b']->sku,
            ],
        ];

        $this->faker = \Faker\Factory::create();
    }

    protected function importProducts(iterable $testProductKeys=[])
    {
        $products = $testProductKeys
        ? array_intersect_key($this->testProducts, array_flip($testProductKeys))
        : $this->testProducts;

        $import = (object)[
            'pageFunctionFinishedAt' => (new \DateTime())->format(\DateTime::ATOM),
            'pageFunctionResult' => $products
        ];

        Product::transformAndSaveResults($import);

        return $import;
    }    
}
