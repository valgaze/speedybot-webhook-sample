## Speedybot-webhooks-sample

Take incoming webhooks + process them

tl;dr: edit **[./settings/webhooks.ts](./settings/webhooks.ts)**, specify webhookUrl in **[./settings/config.json](./settings/config.json)**, and boot with ```npm run start:server```

## Quickstart

Do you want your bot to tell someone (or a group of someones) whenever something happens on an external service like Jira? This is what you need to get up and running fast-- just edit **[./settings/webhooks.ts](./settings/webhooks.ts)** to create a notifer/alert'ing experience using incoming webhooks (ex from a Jira system, support queue, etc)

Note: The steps below assume you have a working WebEx account & **[Nodejs](https://nodejs.org/en/download/)** 12+

## 1. Fetch repo & install dependencies

```
git clone https://github.com/valgaze/speedybot-webhook-sample
cd speedybot-starter
npm i
```

## 2. Set your bot access token

- If you have an existing bot, get its token here: **[https://developer.webex.com/my-apps](https://developer.webex.com/my-apps)**

- If you don't have a bot, create one and save the token from here: **[https://developer.webex.com/my-apps/new/bot](https://developer.webex.com/my-apps/new/bot)**

Once you have the bot's token, save it to **[settings/config.json](./settings/config.json)** under the ```token``` field

## 3. Boot your "tunnel"

For local dev purposes, you will need to (1) sign up for a (free-tier-eligible) "ngrok" account

Follow the steps here: https://dashboard.ngrok.com/get-started/setup

```
./ngrok http 8000
```

Note the forwarding URL (you'll need it in a moment), it will look something like this: **https://5a5b-34-567-789-100.ngrok.io**

## 4) Update webhookUrl

Add '/speedybotwebhook' to the end of the nGrok forwarding url and save it to **[settings/config.json](./settings/config.json)** under the ```webhookUrl``` field

**IMPORTANT:** append '/speedybotwebhook' to the nGrok url

```
forwarding URL: https://5a5b-34-567-789-100.ngrok.io
suffix: /speedybotwebhook
https://5a5b-34-567-789-100.ngrok.io/speedybotwebhook
```

## 5) Boot your bot

```
npm run start:server
```

If all went well, it should look something like this:
![image](https://raw.githubusercontent.com/valgaze/speedybot/master/docs/assets/framework_success.png)

## 4. Run a "healthcheck" with the bot

Add your bot from Step 1 in a 1-1 chat session and tell it "healthcheck"-- if everything is configured properly you should see something like this:

![image](https://raw.githubusercontent.com/valgaze/speedybot/master/docs/assets/healthcheck.gif)

## 5. Make a POST request to your bot's incoming webhook

- /speedybotwebhook is for chat traffic

- You can make as many other webhooks as you want and alert people & rooms

Use ```curl``` or a tool like Postmanm to send a POST request to the webhook specified in: **[./settings/webhooks.ts](./settings/webhooks.ts)**

## 5. Extend

- [ ] From here, you can edit **settings/webhooks.ts** and make your own webhook handlers & integrations

- [ ] Get rid of node altogether...https://github.com/valgaze/speedybot-hub