<?php

namespace Tests;

use App\Product;
use App\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

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
    }

    public function setUp() : void
    {
        parent::setUp();

        User::unguard();

        $this->userData = factory(User::class)
        ->make()
        ->makeVisible(['password']);

        $this->user2Data = factory(User::class)
        ->make()
        ->makeVisible(['password']);

        $this->user = User::create(
            collect($this->userData)
            ->except(['password_raw'])
            ->toArray()
        );
        
        $this->user2 = User::create(
            collect($this->user2Data)
            ->except(['password_raw'])
            ->toArray()
        );

        $this->be($this->user);

        $this->testProducts = [
            'a' => (object) [
                'sku' => 'TESTSKU1',
                'name' => 'My great product A',
                'type' => 'plugin',
                'msrp' => 79,
                'salePrice' => 49,
                'category' => 'Post Production',
                'note' => 'nonsense',
                'saleEnd' => '12/3/2019 5:00:00 AM',
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png',
                'url' => 'https://www.waves.com/plugins/abbey-road-studio-3',
            ],
            'b' => (object) [
                'sku' => 'TESTSKU2',
                'name' => 'My great product B',
                'type' => 'plugin',
                'msrp' => 79,
                'salePrice' => 79,
                'category' => 'Post Production',
                'note' => null,
                'saleEnd' => null,
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png',
                'url' => 'https://www.waves.com/plugins/abbey-road-studio-3',
            ],
            'a_decreased' => (object) [
                'sku' => 'TESTSKU1',
                'name' => 'My great product A',
                'type' => 'plugin',
                'msrp' => 79,
                'salePrice' => 29,
                'category' => 'Post Production',
                'note' => 'nonsense',
                'saleEnd' => '12/3/2019 5:00:00 AM',
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png',
                'url' => 'https://www.waves.com/plugins/abbey-road-studio-3',
            ],
            'b_decreased' => (object) [
                'sku' => 'TESTSKU2',
                'name' => 'My great product B',
                'type' => 'plugin',
                'msrp' => 69.99,
                'salePrice' => 69.99,
                'category' => 'Post Production',
                'note' => null,
                'saleEnd' => null,
                'badge' => 'New',
                'thumbnailUrl' => 'https://img.wavescdn.com/1lib/images/products/plugins/icons/submarine.png',
                'url' => 'https://www.waves.com/plugins/abbey-road-studio-3',
            ],
        ];

        $this->testAlerts = [
            'a' => [
                'event' => 'decrease_by',
                'threshold_unit' => 'percent',
                'threshold_value' => 20,
                'alert_method' => 'email',
                'product_sku' => $this->testProducts['a']->sku,
            ],
            'b' => [
                'event' => 'decrease_by',
                'threshold_unit' => 'percent',
                'threshold_value' => 20,
                'alert_method' => 'email',
                'product_sku' => $this->testProducts['b']->sku,
            ],
            'c' => [
                'event' => 'less_than',
                'threshold_value' => 40,
                'alert_method' => 'email',
                'product_sku' => $this->testProducts['a']->sku,
            ],
        ];

        $this->faker = \Faker\Factory::create();
    }

    protected function importProducts(iterable $testProductKeys=[])
    {
        $product = new Product();

        $originalKeys = collect($testProductKeys ?: array_keys($this->testProducts))->filter( function($item){
            return !Str::Contains($item, '_decreased');
        });

        $changedKeys = collect($testProductKeys ?: array_keys($this->testProducts))->filter( function($item){
            return Str::Contains($item, '_decreased');
        });

        $orignialProducts = array_intersect_key(
            $this->testProducts,
            array_flip($originalKeys->toArray())
        );

        $changedProducts = array_intersect_key(
            $this->testProducts,
            array_flip($changedKeys->toArray())
        );

        $imports = [
            'original' => (object)[
                'finishedAt' => (new \DateTime())->format(\DateTime::ATOM),
                'products' => $orignialProducts,
            ],
            'changed' => (object)[
                'finishedAt' => (new \DateTime())->format(\DateTime::ATOM),
                'products' => $changedProducts,
            ],
        ];

        if($orignialProducts){
            $product->transformAndSaveResults($imports['original']);
        }
        sleep(1); // do audit trail has different created_at values
        if($changedProducts){
            $product->transformAndSaveResults($imports['changed']);
        }
        return $imports;
    }    

    protected function dateTimeToDate($dateTime){
        return $dateTime
            ? Carbon::parse($dateTime)->format('Y-m-d')
            : null;
    }
}
