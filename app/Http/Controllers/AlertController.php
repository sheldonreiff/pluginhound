<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Alert;
use App\User;
use App\Product;
use App\Http\Resources\Alert as AlertResource;
use App\Http\Requests\AlertStoreRequest;

class AlertController extends Controller
{
    private function getAcceptedFields(AlertStoreRequest $request, Product $product=null)
    {
        $fields = collect(
            $request->get('event') === 'any_change'
            ? $request->only(['alert_method', 'event', 'product_sku'])
            : $request->only(['alert_method', 'event', 'threshold_unit', 'threshold_value', 'product_sku'])
        );

        if($product){
            $fields->put('product_sku', $product->sku);
        }

        return $fields->toArray();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($product=null)
    {
        return $product
        ? AlertResource::collection(\Auth::user()->alerts->where('product_sku', $product))
        : AlertResource::collection(User::with('alerts.product')->find(\Auth::id())->alerts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Product $product, AlertStoreRequest $request)
    {
        $validated = collect($request->validated());

        $new_alert = \Auth::user()
        ->alerts()
        ->create(
            $this->getAcceptedFields($request, $product)
        );

        return new AlertResource($new_alert);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Alert $alert)
    {
        if(\Auth::user()->cant('show', $alert)){
            abort(403);
        }

        return new AlertResource($alert);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AlertStoreRequest $request, Alert $alert)
    {
        // if(\Auth::user()->cant('update', $alert)){
        //     abort(403);
        // }

        $validated = collect($request->validated());

        $alert->update(
            $this->getAcceptedFields($request)
        );

        $alert->refresh();

        $alert->load('product');

        return new AlertResource($alert);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Alert $alert)
    {
        if(\Auth::user()->cant('destroy', $alert)){
            abort(403);
        }

        $alert->delete();
    }
}
