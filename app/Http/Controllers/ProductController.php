<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Product;
use Gate;
use App\Jobs\ImportProducts;

use App\Http\Resources\Product as ProductResource;
use App\Http\Resources\ProductHistory as ProductHistoryResoruce;

class ProductController extends Controller
{
    function __construct()
    {
        \Auth::shouldUse('web');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $request->validate([
            'bestDeals' => ['in:true,false', 'nullable'],
            'q' => ['string', 'nullable'],
            'page' => ['integer', 'required'],
            'perPage' => ['integer', 'required'],
        ]);

        $products = $request->bestDeals === 'true'
            ? Product::bestDeals()
            : Product::orderBy('name', 'asc');

        $products->when($request->q, function ($query) use($request) {
            $query->where('name', 'like', "%$request->q%");
        });

        $paginated = $products->paginate($request->perPage);

        return ProductResource::collection(
            $this->hydratePaginationResults($paginated, Product::class)
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(Gate::denies('import-products')){
            abort(403, 'User not allowed to import products');
        }

        $request->validate([
            'eventData.actorId' => ['required', 'string'],
            'eventData.actorRunId' => ['required', 'string'],
        ]);

        ImportProducts::dispatch($request->eventData['actorId'], $request->eventData['actorRunId']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    public function history(Product $product, Request $request)
    {
        $audits = $product->audits();

        $audits->when($request->start, function($query) use($request) {
            $query->whereDate('new_values->scraped_at', '>=', $request->start);
        });
        
        $audits->when($request->end, function($query) use($request) {
            $query->whereDate('new_values->scraped_at', '<=', $request->end);
        });

        return ProductHistoryResoruce::collection( $audits
        ->orderBy('new_values->scraped_at', 'asc')
        ->get()
        ->map(function($audit, $key){
            return $audit->getModified();
        })
        ->filter(function($item, $key){
            return !empty($item['sale_price']['new']) 
            || !empty($item['msrp']['new']);
        }));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
