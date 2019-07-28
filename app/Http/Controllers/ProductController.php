<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Product;

use App\Http\Resources\Product as ProductResource;
use App\Http\Resources\ProductHistory as ProductHistoryResoruce;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->bestDeals === 'true'){
            $products = Product::bestDeals();
        }else{
            $products = Product::comparisons();
        }
        
        if($request->q){
            $products = $products
            ->where('name', 'like', "%$request->q%");
        }

        return ProductResource::collection( Product::hydrate($products->get()->toArray()) );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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

        if($request->start){
            $audits = $audits
            ->whereDate('new_values->scraped_date', '>=', $request->start);
        }
        if($request->end){
            $audits = $audits
            ->whereDate('new_values->scraped_date', '<=', $request->end);
        }

        return ProductHistoryResoruce::collection( $audits
        ->orderBy('new_values->scraped_date', 'asc')
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
