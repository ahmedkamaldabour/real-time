<?php

namespace App\Http\Controllers;

use App\Models\User;

class OnlineUserController extends Controller {
    public function __invoke() {
        $connection = config('broadcasting.connections.pusher');

        $pusher = new \Pusher\Pusher(
            $connection['key'],
            $connection['secret'],
            $connection['app_id'],
            $connection['options'] ?? []
        );

        $users = array_map(function ($user) {
            return $user->id;
        }, $pusher->get('/channels/presence-online-users/users')->users);

        $users = array_unique($users);

        return User::whereIn('id', $users)->get();
    }
}
