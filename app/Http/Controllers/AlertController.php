<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Alert;
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
    public function index($product)
    {
        return new AlertResource(\Auth::user()
        ->alerts
        ->where('product_sku', $product));
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

        return new AlertResource($alert->fresh());
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
