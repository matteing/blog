---
title: "How to build apps for Makerlog"
date: 2018-11-28T15:02:25-04:00
tags: []
categories: []

draft: true
tagline: "A primer on using the Makerlog API to build things."
cover: ""
---

Makerlog has a very rich and useful API for building applications, both third party and first party, as the web frontend is build on top of it.

In this article, I'll try to explain some ways to build cool things using the API, how to explore API documentation, and more. 

Get ready for a journey inside Makerlog.

## Tools you'll need

You'll need a few things to continue along with this journey.

1. Command-line, preferably with tools like cURL installed. We'll be using several command line tools along this tutorial.
2. A text editor. I highly suggest VS Code, as it has an integrated terminal and is generally a really nice editor.
3. Patience. Tons of it.

## Using the playground

![Swagger Playground](https://i.imgur.com/y2SBdaj.png)
[The playground](https://api.getmakerlog.com/v1/playground/) is a webpage where you can interact with the Makerlog API without needing any special tools. It lists things like schemas, available endpoints, and allows you to play around with the API and grasp a better understanding of what you can do with it.

#### Using the playground

When opening the playground, you'll be shown a list of available endpoints for you to explore. Some are read-write, some are read depending on ownership and authorization status.

Let's play with our first endpoint as a guest. Try fetching the list of products launched on Makerlog.

<iframe src="https://giphy.com/embed/5zhcxrBOaj5tAhycSQ" width="480" height="286" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

Just click on the endpoint and try it out.

It's super simple! 😄

#### Signing in to the playground

Some endpoints require authorization. To sign in, just follow the steps listed in the "Portal Usage" section.

## Using the portal

The portal will be your one stop shop for anything API related. Here you can manage OAuth applications, play around with the API, and even explore object schemas. It's what I use to build Makerlog - it's all browsable and easy to discover.

#### Authenticating

This is super simple. Just hit the login button in the top right corner, and sign in with any valid Makerlog credentials. And you're done! 

This will also apply for the App Console and Playground, so beware of doing anything destructive there!

## Authentication

There's several ways to authenticate yourself or others on Makerlog.

#### OAuth
This is a more complicated way to authenticate, but the recommended one for third-party applications.

It requires that you register your application on the [Developer Console](https://api.getmakerlog.com/oauth/applications/). There's a section coming up that will explain in detail how to use this endpoint.

#### Tokens
This is the simplest way to get started, yet the least recommended one for building public-facing apps. getmakerlog.com uses tokens for authenticating you into the UI.

I don't recommend you use this for accessing user data. It's insecure and in case of a data leak, you'll be absolutely screwed. Plus it gives too many permissions you may just not need.

Only use this for client-side apps like mobile clients or web UIs, where you're sure only the user can access the token.

NEVER store these tokens on the server, or I will publicly shame you forever.

##### How to use token-based authentication
Token based authentication works by POSTing a specific endpoint with your authentication details. It returns a JSON object with a "token" key.

Python example:

    # Python requests example.
    payload = {
        'username': 'username',
        'password': 'password',
    }
    req = requests.post('https://api.getmakerlog.com/api-token-auth/', json=payload)
    token = req.json()['token']

JS example, straight from the Makerlog source:

    async function getToken(username, password) {
        try {
            const payload = { username: username, password: password }
            const response = await axios.post('_api-token-auth_', payload);
            return response.data['token'];
        } catch (e) {
             return a pretty error
            prettyAxiosError(e)
        }
    }

###### Using that shiny token

Finally, to use the token, you MUST send this header with every request, exactly as follows - otherwise, it won't work.

    Authorization: Token your-token-here
    # example
    Authorization: Token 342kbbr23rb32ur2obc3o289dc

#### Session
Session based authentication only works on the API portal, which makes it effectively useless unless you're an app developer. 

## OAuth

OAuth is slightly more complicated to implement and use, but it is the recommended way to authenticate users into your applications.

#### Create your first OAuth app

To create an OAuth application, go to [this URL](https://api.getmakerlog.com/oauth/applications/) and click the "Create new application" button.

You will be faced with a form to fill. Give your app a name, save these credentials somewhere safe, and move on to the "Client Type" section.

#### OAuth Client Types

There's two types of clients possible on Makerlog. 

1. Confidential client: utilized for servers, where you'll store the token securely. 
2. Public: utilized for clients which can't keep things secret.

Pick one. I don't see much relevance to this setting, so just pick public.

#### OAuth Grant Types

Makerlog has several ways to grant a token. Here is a rundown.

##### Authorization code (recommended)
After a user authorizes the application, it redirects to the given redirect URL a authorization code your server can use to request a token. This is the recommended option for apps that utilize user data.

##### Implicit
Returns an OAuth token directly on request. Less secure, as the client receives the token instead of requesting it on the server.

##### Resource-owner password based
You must provide the user's credentials (user and password) rather than authorization. Discouraged unless you're testing the API out. It's exactly like API token auth.

##### Client credentials
Uses your client credentials (secret/id) to authenticate. Has no permissions, really.

#### OAuth Scopes
There's several scopes available for your application to use.

1. tasks:read, tasks:write
2. products:read, products:write
3. projects:read, projects:write
4. notifications:read
5. user:read, user:write

More scopes are on the way - full functionality is available using the token authentication for clients.

#### Grabbing some tokens
Makerlog conforms to the OAuth2 spec religiously. [Read these docs if in doubt. It's super complicated at times.](https://aaronparecki.com/oauth-2-simplified/)

##### Implicit authentication or authorization code
To grab tokens using this method, you must redirect your users to an authorization endpoint with the following scheme:

    # Required parameters:
    # client_id of your app
    # scopes to use
    # IF your app is implicit: response_type = token
    # Authorization code: response_type=code
    https://api.getmakerlog.com/oauth/authorize/?client_id=client-id-here&scopes=user:read,user:write&response_type=code

**IF you selected implicit auth type, you're done. You'll get a token in exchange. If you picked, authorization code, read on.**

If you picked authorization code it will return an access code, which you can exchange for a authorization token on the server or client. It will redirect to an URL like this:

    https://redirect-url/#code=access-code

Let's exchange this access token! Must be done in the server.

    curl -X POST -d "grant_type=authorization_code&code=<code>&redirect_uri=<redirect_uri>" -u "<client_id>:<client_secret>" https://api.getmakerlog.com/oauth/token/

Done. You'll receive a token in exchange!

##### Resource-owner password based
This one is quite straightforward, but not recommended.

    curl -X POST -d "grant_type=password&username=<user_name>&password=<password>" -u"<client_id>:<client_secret>" https://api.getmakerlog.com/oauth/token/

Don't use it.

#### Using your tokens

To use your tokens, just add the following header to all your requests.

    Authorization: Bearer your-token-here
    # Example
    Authorization: Bearer 3vrw43vwrw3r3wrvw3cgtbte44

#### More resources on OAuth

As you can probably tell, I hate writing docs for OAuth. It's tedious and annoying. I'm happily willing to answer any questions, though. Don't hesitate to DM. I don't bite!

Here are a few resources to help you out:

1. [OAuth 2 Simplified](https://aaronparecki.com/oauth-2-simplified/)
2. [Django OAuth Toolkit Documentation](https://django-oauth-toolkit.readthedocs.io/en/latest/rest-framework/rest-framework.html)

## General API notes

1. Makerlog follows REST religiously, so if in doubt on how to do something, there's probably a RESTful way to do it. This tutorial won't cover every bit of the API, but it will show you how to complete basic tasks in an easy to read format! 😜

## Schema
To get the schema for any returned object on Makerlog, [click here](https://api.getmakerlog.com/v1/playground/).

## User operations
There's several user operations you can execute.

### Get any user object
_Does not require authentication._
To get anyone's user object, fire a GET request to `/users/username-goes-here/`.

```
GET https://api.getmakerlog.com/users/sergio/ 🔽
{
    "id": 1,
    "username": "sergio",
    "first_name": "Sergio",
    "last_name": "Mattei Díaz",
    "status": "shipping Makerlog & Opsbot",
    "description": "Maker of Makerlog.",
    "verified": false,
    "private": false,
    "avatar": "https://gravatar.com/avatar/ff35ca0a5f96fec410d7307e9131792e?s=150&d=mm&r=pg",
    "streak": 184,
    "streak_end_date": "2019-01-15T19:00:00.190818-05:00",
    "timezone": "America/New_York",
    "week_tda": 4,
    "activity_trend": [1, 2, 3],
    "twitter_handle": "matteing",
    "instagram_handle": "diettam",
    "product_hunt_handle": "ftxrc",
    "github_handle": "matteing",
    "header": "https://api.getmakerlog.com/media/uploads/headers/2018/12/29/alex-jumper-1254291-unsplash.jpg",
    "is_staff": true,
    "donor": false,
    "tester": false,
    "telegram_handle": "matteing",
    "digest": true,
    "gold": true,
    "accent": "#af47e0",
    "maker_score": 1231
}
```

### Get logged in user object
_Requires the user:read scope, and authentication._

To get username, basic stats, and other goodies, fire a GET request to `/me/`.

```
GET https://api.getmakerlog.com/me/ 🔽
{
    "id": 1,
    "username": "sergio",
    "first_name": "Sergio",
    "last_name": "Mattei Díaz",
    "status": "shipping Makerlog & Opsbot",
    "description": "Maker of Makerlog.",
    "verified": false,
    "private": false,
    "avatar": "https://gravatar.com/avatar/ff35ca0a5f96fec410d7307e9131792e?s=150&d=mm&r=pg",
    "streak": 184,
    "streak_end_date": "2019-01-15T19:00:00.190818-05:00",
    "timezone": "America/New_York",
    "week_tda": 4,
    "activity_trend": [1, 2, 3],
    "twitter_handle": "matteing",
    "instagram_handle": "diettam",
    "product_hunt_handle": "ftxrc",
    "github_handle": "matteing",
    "header": "https://api.getmakerlog.com/media/uploads/headers/2018/12/29/alex-jumper-1254291-unsplash.jpg",
    "is_staff": true,
    "donor": false,
    "tester": false,
    "telegram_handle": "matteing",
    "digest": true,
    "gold": true,
    "accent": "#af47e0",
    "maker_score": 1231
}
```

#### Modify logged in user object
_Requires the user:write scope._

To modify user settings, just fire a PATCH request to the same endpoint.

```
// PATCH https://api.getmakerlog.com/me/
payload = {
    keyToModify: 'newValue',
    // example given:
    // unsubscribe from the weekly digest.
    digest: false,
}
// Pseudocode:
const resp = await client.patch('https://api.getmakerlog.com/me/', payload);
console.log(resp) // returns updated user object.
```

## Task operations
Scopes:
1. `tasks:read`, `tasks:write`

### On task IDs
If you don't have the ID of the task, you can use the Makerlog UI to look for the task, copy the permalink, and simply replace the domain in the URL with "api.getmakerlog.com".

#### Create a task
_Requires the tasks:write scope._

To create a task, you must send a POST request to `/tasks/`.
This endpoint takes a few fields:

```
const payload = {
    content: 'My new task',
    done: false,
    in_progress: false, // optional. if you set it to true it will override done.
    attachment: attachment, // must be used with multipart content-type, as you can't transfer images with JSON.
}
```

Here's some example pseudocode of a function that creates a task:

```
// With attachment support: https://gitlab.com/makerlog/web/blob/master/src/lib/tasks.js
async function createTask(content, done=false, in_progress=false) {
    try {
        const payload = { content, done, in_progress }
        // POST https://api.getmakerlog.com/tasks/
        const response = await client.post('/tasks/', payload)
        return response.data;
    } catch (e) {
        console.log(e)
    }
}
```

#### Update a task
_Requires the tasks:write scope._

To update a task, you must send a PATCH request to `/tasks/${task-id}`.

In this endpoint, you can modify any available field within the returned object, except datetime fields. 
Here's some example pseudocode of a function that updates a task:

```
async function updateTask(id, content) {
    try {
        const payload = { content }
        // POST https://api.getmakerlog.com/tasks/${id}
        const response = await client.post(`/tasks/${id}`, payload)
        return response.data;
    } catch (e) {
        console.log(e)
    }
}

// Let's say the task in question is ID 1.
await updateTask(1, 'My old task was edited just now.')
```

#### Delete tasks
_Requires the tasks:write scope._

To delete a task, you must send a `DELETE` request to `/tasks/${task-id}`.

```
async function deleteTask(id) {
    try {
        // Fires a DELETE request to the endpoint.
        await client.delete(`/tasks/${id}`);
    } catch (e) {
        console.log(e)
    }
}
```

## Using realtime feeds
_No authentication is required to most realtime feeds, except for `/stream`, `/tasks`, and `/notifications`._

### How to use
All streams below are WebSockets streams, so you need a WebSockets client to communicate and receive events as they happen. 

Makerlog uses [RWS](https://github.com/josdejong/rws), which is a great client with auto connect support. 

For the purposes of this tutorial, we'll use a [command-line client called wsc](https://www.npmjs.com/package/wsc). Install it and return to this tutorial.

### Event types
All events carry a type and a payload. 

1. `task.created`: payload: task object
2. `task.deleted`: payload: task object
3. `task.updated`: payload: task object
4. `task.sync`
5. `notification.counts`: payload: int of unread notification counts

### Public feeds

```
path('explore/stream/', GlobalTasksConsumer),
# It will work anyways with PK or no pk
path('users/<int:pk>/stream/', UserTasksConsumer),
path('products/<slug:slug>/stream/', ProductTasksConsumer),
path('stream/', FollowingTasksConsumer),
path('notifications/', NotificationsConsumer),
```
1. `wss://api.getmakerlog.com/explore/stream/` - This stream displays all realtime activity on Makerlog, from all users. Use event types beginning with `task` to handle these events.
2. `wss://api.getmakerlog.com/users/${id}/stream/` - This stream gets all realtime activity for a specific user on Makerlog. Use event types beginning with `task`.
3. `wss://api.getmakerlog.com/products/${product.slug}/stream/` - This stream gets all realtime activity for a specific product on Makerlog. Use event types beginning with `task`.

### Private feeds

**To use private feeds, pass the authentication token with the `token` WSS parameter, and MAKE SURE you are using `wss://`, as it's encrypted. WS does not hold session state, so this is critical.**

1. `wss://api.getmakerlog.com/stream/` - This stream displays all realtime activity on Makerlog for a logged in user. Use event types beginning with `task` to handle these events.
2. `wss://api.getmakerlog.com/notifications/` - This stream gets realtime notification counts for a specific user on Makerlog. Use event types beginning with `notification`.

### Let's try a stream out

Let's see your realtime data on Makerlog!

#### Step 1: Grab your user ID
The first step is to grab your user ID, as we'll need it to initiate the stream. Head over to the [API Console](https://api.getmakerlog.com), sign in, and then [click here](https://api.getmakerlog.com/me). It will return an user object like this:

![Your user object](https://i.imgur.com/tDg95rM.png)

#### Step 2: Initiate the stream
Now, open your favorite terminal client and, assuming you've installed [wsc](https://www.npmjs.com/package/wsc), run the following command:
```
wsc wss://api.getmakerlog.com/users/your-id-here/stream/
```
If the connection initiates successfully, you'll see this screen, which means it's awaiting server events. Yay!

![Awaiting screen](https://i.imgur.com/XLTf1c5.png)

#### Step 3: Trigger an action and see the magic!
The last step is to create a task anywhere (mobile or web) and you'll see an event received instantly!

<div style="width:100%;height:0;padding-bottom:50%;position:relative;"><iframe src="https://giphy.com/embed/1rL5UZPERGRh2yuByw" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

### Handling events with JavaScript
Most of the time, you'll be using streams on a frontend with JavaScript enabled. Luckily, JS makes WebSockets a breeze to work with and you can handle events in a couple of minutes. Then again, if you want more flexibility, I highly suggest replacing the default WS client with [RWS](https://github.com/josdejong/rws).

Here's a bit of pseudocode that would handle a WebSocket connection receiving tasks:

```
const socket = WebSocket('wss://api.getmakerlog.com/explore/stream');
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(`Makerlog: Event received through WS. (${data.type})`, data.payload)
    switch(data.type) {
        case 'task.created':
        case 'task.updated':
        case 'task.sync':
            if (data.batch) {
                // Sometimes the API sends batch data to save bandwidth. Prepare for payload to be an array.
            }
            console.log("Task created/updated/synced", data.payload)
            break;

        case 'task.deleted':
            console.log("Task deleted", data.payload)
            break;

        default:
            console.log("Other event", data.payload)
            return;
    }
}
```

## Notifications
### Object structure
Notification objects on Makerlog consist of a few important keys. Here's an example notification:

```
{
    "id": 43211,
    "key": "received_praise", // this is the type of notification received.
    "read": false, // read or not
    "verb": "praised you 68 times", // verb to use when displaying notification
    "recipient": { // the recipient user object.
        "id": 1,
        "username": "sergio",
        ...
    },
    "actor": { // User who triggered the notification.
        "id": 1290,
        "username": "randlocher",
        ...
    },
    "target": { // Target object. Could be a task, project, product, anything.
        ... 
    },
    "broadcast_link": null,
    "created": "2019-01-17T18:12:12.066455+01:00"
},
```

The most important keys here are "key", "read", "recipient", "actor", and "target".

### Types of notifications
This changes frequently as new features are added, but here's a rundown of the base notification types. You can keep an eye on new types and code examples [here](https://gitlab.com/makerlog/web/blob/master/src/features/notifications/components/Notification.js).

1. `received_praise` - the user has received praise. Use the verb when displaying. Target is a task object.
2. `followed` - the user was followed. Use the verb. Target is a user object.
3. `user_joined` - the user just joined Makerlog! This is more vendor-specific.
4. `broadcast` - I've sent a broadcast that everyone needs to see. 😉
5. `thread_created` - a thread was created on Makerlog. Target is a discussion object.
6. `thread_replied` - a thread was replied to on Makerlog. Target is a discussion object.
7. `task_commented` - a task was commented on. Target is a task object.
8. `product_launched` - a product was launched. Target is a product object.
9. `product_created` - a product was created. Target is a product object.
10. `user_mentioned` - a user was mentioned in a task. Target is a task object.
11. `mention_discussion` - a user was mentioned in a discussion. Target is a discussion object.


### Fetching unread notifications
_This requires the notifications:read scope._

To fetch unread notification objects, just fetch `/notifications`. 

```
async function getNotifications() {
    try {
        const { data } = await client.get('/notifications/')
        return data
    } catch (e) {
        console.log(e)
    }
}

// Fetch notifications
const notifications = await getNotifications();
// Filter read only
const readNotifications = notifications.filter(n => n.read === true)
// Filter unread only
const unreadNotifications = notifications.filter(n => n.read === false)
```

### Getting notification counts
_This requires the notifications:read scope._

To get notification counts, you have two options: HTTP or realtime feeds. Realtime feeds were discussed previously, and it's the preferred method. If you'd still like to go with HTTP though, just send a GET request to `/notifications/unread_count`.


## Stats
Stats are a core element of Makerlog, and most are public as it encourages accountability on Makerlog. They're a great way to create small apps and stay in the loop using Makerlog's platform.

### Getting your stats
_This requires authentication._

To get a user's stats, all you need is to fetch the `/stats/` endpoint.

```
// api.getmakerlog.com/stats/

async function getMyStats() {
    try {
        const { data } = await client.get(`/stats/`);
        return data
    } catch (e) {
        console.log(e)
    }
}
```

### Getting a user's stats
_Does not require authentication._ 

To get a user's stats, all you need is to fetch the `/stats/` endpoint of [any user object](#get-any-user-object) in the API.

```
// api.getmakerlog.com/users/your-username-here/stats/

async function getStats(username) {
    try {
        const { data } = await client.get(`/users/${username}/stats/`);
        return data
    } catch (e) {
        console.log(e)
    }
}
```

### Getting world stats
_Does not require authentication._ 

To get daily Makerlog stats, all you need is to fetch the `/stats/world/` endpoint.

```
// api.getmakerlog.com/stats/world/

async function getWorldStats() {
    try {
        const { data } = await client.get(`/stats/world/`);
        return data
    } catch (e) {
        console.log(e)
    }
}
```

### Getting open stats
_Does not require authentication._ 

To get open stats on user counts, etc. all you need is to fetch the `/open/` endpoint.

```
// api.getmakerlog.com/open/

async function getOpenStats() {
    try {
        const { data } = await client.get(`/open/`);
        return data
    } catch (e) {
        console.log(e)
    }
}
```

## Example: Making a CLI tool
## Sample functions
## Links
## Conclusion