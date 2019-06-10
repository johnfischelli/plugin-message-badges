# Message Badges

![Message Badges](https://indigo-bombay-5783.twil.io/assets/message-badges.png)

Display a count of unread message on the task list component. Works with both Chat and SMS Channels.

## How it works

Under the hood, Flex uses the Twilio Programmable Chat SDK. It's possible to dip down and interact with the Chat SDK to ask it about unread messages in the channel.

### Key Concepts

* The chat channelSid is stored in the task's attributes.
* The Flex "manager" object allows you to access the underlying Chat Client
* Using the above you can instantiate a [channel object](http://media.twiliocdn.com/sdk/js/chat/releases/3.2.3/docs/Channel.html) from the [Twilio Chat SDK](http://media.twiliocdn.com/sdk/js/chat/releases/3.2.3/docs/index.html)
* Now you can listen to all sorts of [interesting events](http://media.twiliocdn.com/sdk/js/chat/releases/3.2.3/docs/Channel.html#event:memberJoined) that are happening in the underlying chat channel.
* Ask the Channel object [how many unread messages](http://media.twiliocdn.com/sdk/js/chat/releases/3.2.3/docs/Channel.html#getUnconsumedMessagesCount__anchor) there are.

### Styling Notes

The CSS here is a bit rough at the moment, PR's absolutely welcome. Unfortunately this component must be added AFTER the task list item component in the document flow. I'd prefer to absolutely position the badge relative to the task list item itself, but its not possible to place the badge in the DOM at the correct place right now.

We're using some floats and negative margins at the moment. Again, if theres a better way, please submit a PR.

Twilio Flex Plugin Boilerplate below...

---

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards install the dependencies by running `npm install`:

```bash
cd plugin-rbfcu-chat-badges

# If you use npm
npm install
```

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it, in order to deply it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex which would provide them globally.