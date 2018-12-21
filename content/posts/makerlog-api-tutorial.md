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

1. **Command-line, preferably with tools like cURL installed.** We'll be using several command line tools along this tutorial.
2. **A text editor.** I highly suggest VS Code, as it has an integrated terminal and is generally a really nice editor.
3. **Patience.** Tons of it.

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
**This is a more complicated way to authenticate, but the recommended one for third-party applications.**

It requires that you register your application on the [Developer Console](https://api.getmakerlog.com/oauth/applications/). There's a section coming up that will explain in detail how to use this endpoint.

#### Tokens
This is the simplest way to get started, yet the **least recommended one** for building public-facing apps. getmakerlog.com uses tokens for authenticating you into the UI.

I don't recommend you use this for accessing user data. It's insecure and in case of a data leak, you'll be absolutely screwed. Plus it gives too many permissions you may just not need.

Only use this for client-side apps like mobile clients or web UIs, where you're sure only the user can access the token.

**NEVER store these tokens on the server, or I will publicly shame you forever.**

##### How to use token-based authentication
Token based authentication works by POSTing a specific endpoint with your authentication details. It returns a JSON object with a "token" key.

**Python example:**

    # Python requests example.
    payload = {
        'username': 'username',
        'password': 'password',
    }
    req = requests.post('https://api.getmakerlog.com/api-token-auth/', json=payload)
    token = req.json()['token']

**JS example, straight from the Makerlog source:**

    async function getToken(username, password) {
        try {
            const payload = { username: username, password: password }
            const response = await axios.post('/api-token-auth/', payload);
            return response.data['token'];
        } catch (e) {
            // return a pretty error
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

Pick one. I don't see much relevance to this setting, so just pick confidential to be safe.

#### OAuth Grant Types

Makerlog has several ways to grant a token. Here is a rundown.

##### Authorization code (recommended)
After a user authorizes the application, it redirects to the given redirect URL a authorization code your server can use to request a token. **This is the recommended option for apps that utilize user data.**

##### Implicit
Returns an OAuth token directly on request. Less secure, as the client receives the token instead of requesting it on the server.

##### Resource-owner password based
You must provide the user's credentials (user and password) rather than authorization. **Discouraged unless you're testing the API out. It's exactly like API token auth.**

##### Client credentials
Uses your client credentials (secret/id) to authenticate. Has no permissions, really.

#### OAuth Scopes
There's several scopes available for your application to use.

1. tasks:read, tasks:write
2. products:read, products:write
3. projects:read, projects:write
4. notifications:read
5. me:read, me:write

More scopes are on the way - full functionality is available using the token authentication for clients.

#### Grabbing some tokens
Makerlog conforms to the OAuth2 spec religiously. [Read these docs if in doubt. It's super complicated at times.](https://aaronparecki.com/oauth-2-simplified/)

##### Authorization code and Implicit
To grab tokens using this method, you must redirect your users to an authorization endpoint with the following scheme:

    # Required parameters:
    # client_id of your app
    # scopes to use
    # response_type = token
    https://api.getmakerlog.com/oauth/authorize/?client_id=client-id-here&scopes=me:read,me:write&response_type=token

It will return an access token, which you can exchange for a authorization token on the server or client - depending on whether you chose authorization code or implicit (if implicit, you have your access token - no need to do anything further. otherwise, read on). It will redirect to an URL like this:

    https://redirect-url/#code=token

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

## User operations
There's several user operations you can execute.

## Task operations
## Product & Project operations
## Using realtime feeds
## Notifications
## Permissions
## Example 1: Making a to-do Chrome extension
## Example 2: Making a CLI tool
## Sample functions
## Links
## Conclusion