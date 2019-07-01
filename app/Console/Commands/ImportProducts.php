<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Product;

class ImportProducts extends Command
{

    protected $act_id;
    protected $run_id;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:import {act_id} {run_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from a specific Apify crawler execution';

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
    public function handle(Product $product)
    {
        $product->import($this->argument('act_id'), $this->argument('run_id'));
    }
}
