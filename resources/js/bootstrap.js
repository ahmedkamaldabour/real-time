import _ from 'lodash';
window._ = _;

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

console.log('Hello from Echo server');


window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

// listen for presence changes on the on online-users channel
// and update the online users list on the page have id="online-users"

window.Echo.join(`online-users`)
    .here((users) => {
        console.log('here');
        console.log(users);
        if (users.length > 0) {
            let userIds = users.map(u => u.id);
            let listItems = users.map(u => `<li id="user-${u.id}">User ${u.id} (${u.name} - ${u.email})</li>`);
            document.getElementById('online-users').innerHTML = listItems.join('');
        }
    })
    .joining((user) => {
        console.log('joining');
        console.log(user);
        document.getElementById('online-users').innerHTML += `<li id="user-${user.id}" class="bg-green-500">User ${user.id} (${user.name} - ${user.email})</li>`;
    })
    .leaving((user) => {
        console.log('leaving');
        console.log(user);
        document.getElementById(`user-${user.id}`).remove();
    });
