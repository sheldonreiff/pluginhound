<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\Product;

class ImportProducts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $actorId;
    protected $actorRunId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($actorId, $actorRunId)
    {
        $this->actorId = $actorId;
        $this->actorRunId = $actorRunId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(Product $product)
    {
        $product->import($this->actorId, $this->actorRunId);
    }
}
