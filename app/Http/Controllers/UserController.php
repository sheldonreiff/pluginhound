<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Rules\Password;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $request->validate([
            'email' => 'email|required|unique:users',
            'first_name' => 'string|required|min:2',
            'last_name' => 'string|required|min:2',
            'password' => ['required', 'confirmed', new Password],
            'password_confirmation' => 'required'
        ]);

        User::register($request->only(['email', 'first_name', 'last_name', 'password']))
        ->sendEmailVerificationNotification();
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
