# Chats

WIP

Create an actions object.

```js
const actions = {
  start: {
    // will be called when the user types /start
    func: start,
  },
  added: {
    // will be called when your bot is added to a space or channel
    func: added,
  },
  removed: {
    // will be called when your bot is removed from a space or channel
    func: removed,
  },
  chat: {
    // will be called for any message that isn't a slash command or button click
    func: chat,
  },
}
```
