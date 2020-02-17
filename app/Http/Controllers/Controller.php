<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Hydrate all paginator items if first item is not the expected eloquent instance (assumes first item
     * is representative of all items).
     * Fixes array access issue caused by changes in \Illuminate\Http\Resources\DelegatesToResource.
     * https://github.com/laravel/framework/commit/dbb3b8c7f503f872d63b0fd8aecfcc60b1a19ca8#diff-051f4207f04389c85d22b75ab28c71a6
     * 
     * @param Illuminate\Pagination\LengthAwarePaginator $paginator
     * @param Illuminate\Database\Eloquent\Model $model
     */
    protected function hydratePaginationResults($paginator, $model)
    {
        $items = collect($paginator->items());

        if(!$items->isEmpty() && !($items[0] instanceof $model)){
            $hydratedItems = $items->map(function($item) use($model) {
                return new $model(get_object_vars($item)); 
            });

            return new \Illuminate\Pagination\LengthAwarePaginator(
                $hydratedItems,
                $paginator->total(),
                $paginator->perPage()
            );
        }

        return $paginator;
    }
}
