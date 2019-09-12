<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Illuminate\Support\Facades\DB;
use App\Product;

class SyncLegacyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'legacy:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync product history with legacy data source';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    protected function batch()
    {
        return DB::connection('legacy')
        ->table('products_history')
        ->selectRaw("sku,
        name,
        type,
        null as category,
        msrp_price as msrp,
        sale_price as salePrice,
        note,
        case when sale_end = '0000-00-00 00:00:00' then
            null
        else
            sale_end
        end as saleEnd,
        badge,
        thumbnail_url as thumbnailUrl,
        time,
        null as url")
        ->orderBy('id');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $confirm = $this->ask("Sync legacy data? This should only be done when the database is fresh [y/n]");

        $saved = 0;
        $batchNum = 0;
        if($confirm === 'y'){

            $this->batch()->chunk(500, function ($batch) use( &$saved, &$batchNum ) {
                $product = new Product();
                $product->dontSendAlerts();

                $this->info("Got {$batch->count()} records");

                foreach($batch as $item){
                    $record = (object)$item;
                    $product->transformAndSaveResults((object)[
                        'products' => [$record],
                        'finishedAt' => $record->time,
                    ], false);
                    $saved += 1;
                }

                $this->info("Batch $batchNum done");

                $batchNum += 1;
            });

            $this->info("$saved product history records imported");
        }else{
            $this->info("Nothing imported");
        }
    }
}
