<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Product;

class ImportProducts extends Command
{

    protected $exec_id;
    protected $act_id;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:import {exec_id}';

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
        $product->import($this->argument('exec_id'));
    }
}
