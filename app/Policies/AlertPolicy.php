<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Alert;

class AlertPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Alert $alert)
    {
        return $user->id === $alert->user_id;
    }

    public function destroy(User $user, Alert $alert)
    {
        return $user->id === $alert->user_id;
    }

    public function show(User $user, Alert $alert)
    {
        return $user->id === $alert->user_id;
    }
}
