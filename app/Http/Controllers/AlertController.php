<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Alert;
use App\User;
use App\Http\Resources\Alert as AlertResource;
use App\Http\Requests\AlertStoreRequest;

class AlertController extends Controller
{
    private function getAcceptedFields(AlertStoreRequest $request)
    {
        return $request->get('event') === 'any_change'
        ? $request->only(['alert_method', 'event', 'product_sku'])
        : $request->only(['alert_method', 'event', 'threshold_unit', 'threshold_value', 'product_sku']);
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
    public function store(AlertStoreRequest $request)
    {
        $validated = collect($request->validated());

        $new_alert = \Auth::user()
        ->alerts()
        ->create(
            $this->getAcceptedFields($request)
        );

        return new AlertResource($new_alert);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        $alert->delete();
    }
}
