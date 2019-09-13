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
    protected $signature = 'products:cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cache all product aggregate values (discount, average_sale_price)';

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
        CacheAllProductAggregates::dispatch();
    }
}
