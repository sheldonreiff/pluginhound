<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Rules\Password;
use Hash;
use Auth;


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
        ]);

        User::register($request->only(['email', 'first_name', 'last_name', 'password']))
        ->sendEmailVerificationNotification();
    }

    protected function updatePassword($data)
    {
        if(!Hash::check($data['current_password'], Auth::user()->password)){
            abort(400, 'Invalid current password');
        }

        Auth::user()->update(['password' => Hash::make($data['new_password'])]);
    }

    protected function updateEmail($data)
    {
        $user = Auth::user();

        if($data['email'] !== $user->email){
            $user->email_verified_at = null;
        }

        $user->email = $data['email'];

        $user->save();

        Auth::user()->sendEmailVerificationNotification();
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
    public function update(Request $request)
    {
        if($request->new_password || $request->current_password || $request->new_password_confirmation){
            $request->validate([
                'current_password' => 'required|min:2',
                'new_password' => ['required', 'confirmed', new Password],
            ]);

            $this->updatePassword($request->only(['current_password', 'new_password']));
        }

        if($request->email){
            $request->validate([
                'email' => 'required|email'
            ]);

            $this->updateEmail($request->only(['email']));
        }

        $request->validate([
            'first_name' => 'string|max:100|nullable',
            'last_name' => 'string|max:100|nullable',
        ]);

        Auth::user()->update(array_filter($request->only(['first_name', 'last_name'])));
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
