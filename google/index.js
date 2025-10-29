import { chatResponse, textResponse } from './builder.js'
import { GoogleChatFormatter } from './formatter.js'

export class GoogleChat {
  constructor(c, opts) {
    this.c = c
    this.opts = opts
    this.actions = opts.actions || {}
    this.formatter = new GoogleChatFormatter()
  }

  // args.args is split string.
  // args.params is an object with key/values
  async slashCommand(c, args) {
    let action = args.action
    console.log('action:', action)
    let cmd = this.actions
    let path = action.split('.')
    for (let i = 0; i < path.length; i++) {
      if (cmd[path[i]]) {
        cmd = cmd[path[i]]
      } else {
        cmd = this.actions.default || { func: this.unknownAction }
        break
      }
    }
    return await cmd.func(c, args)
  }

  async handleChatRequest(c, input) {
    if (this.opts.apiURL) {
      c.data.apiURL = this.opts.apiURL
    }
    if (!input.chat) {
      return await textResponse(c, "I don't understand this input, no chat field!")
    }
    if (input.chat.removedFromSpacePayload) {
      c.data.logger.log('Removed from space', input.chat.removedFromSpacePayload)
      return { message: 'Removed from space' }
    }
    if (input.chat.addedToSpacePayload) {
      c.data.logger.log('Added to space', input.chat.addedToSpacePayload)
      let start = this.actions['start'] || { func: this.start }
      return await start.func(c, null)
    }

    let payload = input.chat.appCommandPayload || input.chat.messagePayload || input.chat.buttonClickedPayload
    // console.log('payload:', payload)
    let message = payload.message
    c.data.message = message

    // user who initiated is input.chat.user
    // user who sent the message is message.sender

    if (this.opts.onParse) {
      await this.opts.onParse(c, {
        userId: input.chat.user.name,
        spaceId: message.space.name, message,
        user: this.normalizeUser(input.chat.user), space: this.normalizeSpace(message.space)
      })
    }

    if (input.commonEventObject) {
      // then we have a button clicked or a form posted!
      let evt = input.commonEventObject
      // console.log('evt:', evt)
      // form inputs:
      let formInput = evt.formInputs
      // this is the button paramters:
      let parameters = evt.parameters
      if (parameters) {
        if (parameters.action) {
          return await this.slashCommand(c, { action: parameters.action, params: parameters, formInput })
        }
      }
    }

    let r = await this.handleChat(c, payload)
    // console.log('sending:', r.hostAppDataAction.chatDataAction.createMessageAction.message)
    return r
  }

  async handleChat(c, payload) {
    let text = payload.message.text
    console.log('text:', text)

    if (text && text.startsWith('/')) {
      let command = text.split(' ')[0].slice(1)
      console.log('command:', command)
      let args = text.split(' ').slice(1)
      console.log('args:', args)
      return await this.slashCommand(c, { action: command, args: args })
    }
    if (this.actions.chat) {
      return await this.actions.chat.func(c, { text, payload })
    }
    return await this.unknownChat(c, { text, payload })
  }

  unknownChat(c, args) {
    return textResponse(c, `Hi 👋, what can I do ya for? Try /start to get started.`)
  }

  unknownAction(c, args) {
    return textResponse(c, `Unknown command: ${args.action}`)
  }

  async start(c, args) {
    return await chatResponse(c, {
      text: 'Howdy! What can I do for you? Try /start to get started.',
      cards: [
        {
          buttons: [
            {
              text: 'Start',
              action: 'start',
            },
          ],
        },
      ],
    })
  }

  normalizeUser(u) {
    if (!u) return null
    // let m = u.name.match(/users\/(.*)$/) // if we want to strip off the users/ prefix
    return {
      id: u.name, // m ? m[1] : u.name,
      name: u.displayName,
      email: u.email,
      type: u.type,
      image: u.avatarUrl,
    }
  }

  normalizeSpace(s) {
    if (!s) return null
    // let m = s.name.match(/spaces\/(.*)$/) // if we want to strip off the spaces/ prefix
    return {
      id: s.name, // m ? m[1] : s.name,
      name: s.displayName,
      type: s.type,
    }
  }

}
