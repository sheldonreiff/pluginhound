<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Product;
use App\Jobs\CacheAllProductAggregates;

class CacheProductAggregates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:cache {--sku= : A product sku to save aggregates for }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cache product aggregate values (discount, average_sale_price)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if($this->option('sku')){
            $product = Product::findOrFail($this->option('sku'))
            ->forceCacheProductAggregates();
        }else{
            CacheAllProductAggregates::dispatch();
            $this->info('Product cache job queued');
        }
    }
}