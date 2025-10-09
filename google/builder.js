import { nanoid } from 'nanoid'
import { hostURL } from '../../../utils.js'
import { GoogleChatFormatter } from '../../text/chatFormatter.js'
import { GoogleChatAPI } from './chatApi.js'

export async function textResponse(c, message) {
  return await chatResponse(c, {
    text: message,
  })
}

export async function chatResponse(c, message, opts = {}) {
  let r = buildResponse(c, message)
  console.log('response:', r)
  // console.log(r.cardsV2[0]?.card)
  let mid = nanoid()
  c.data.messageId = mid

  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          // messageId: `client-${mid}`,
          message: r,
        },
      },
    },
  }
}

function buildResponse(c, content) {
  let text = content.text

  let cards = []
  if (content.cards) {
    for (let card of content.cards) {
      let c2 = { card: buildCard(c, card) }
      if (card.id) {
        c2.cardId = card.id
      }
      cards.push(c2)
    }
  }

  return {
    text,
    cardsV2: cards,
  }
}

function buildCard(c, c2) {
  let widgets = []
  let card = {}

  if (c2.images) {
    for (let image of c2.images) {
      widgets.push({
        image: {
          imageUrl: image.url,
        },
      })
    }
  }
  if (c2.textBuilder) {
    widgets.push({
      textParagraph: {
        text: new GoogleChatFormatter(c2.textBuilder).toHTML(),
      },
    })
  } else if (c2.text) {
    widgets.push({
      textParagraph: {
        text: c2.text,
      },
    })
  }
  if (c2.image) {
    widgets.push({
      image: {
        imageUrl: c2.image,
      },
    })
  }
  if (c2.buttons) {
    let buttons = []
    // console.log('buttons:', c2.buttons)
    for (const b of c2.buttons) {
      // for (const b of b2) {
      let params = [
        {
          key: 'action',
          value: b.action,
        },
      ]
      if (b.params) {
        params.push(...b.params)
      }
      if (b.action) {
        buttons.push({
          text: b.text,
          onClick: {
            action: {
              function: hostURL(c) + '/v1/gchat',
              parameters: params,
            },
          },
        })
      } else if (b.url) {
        buttons.push({
          text: b.text,
          onClick: {
            openLink: {
              url: b.url,
            },
          },
        })
      }
      // }
    }
    widgets.push({
      buttonList: {
        buttons: buttons,
      },
    })
  }
  if (c2.form) {
    for (let field of c2.form.fields) {
      widgets.push(formField(c, field))
    }
  }
  if (c2.header) {
    card.header = {
      title: c2.header.title,
    }
    if (c2.header.subTitle) {
      card.header.subtitle = c2.header.subTitle
    }
    if (c2.header.image) {
      card.header.imageUrl = c2.header.image
    }
  }
  card.sections = [
    {
      widgets: widgets,
    },
  ]

  return card
}

function formField(c, field) {
  if (field.type == 'buttons') {
    return {
      buttonList: {
        buttons: field.buttons.map((b) => {
          return {
            text: b.text,
            onClick: {
              action: {
                function: hostURL(c) + '/v1/gchat',
                parameters: b.params || [],
              },
            },
          }
        }),
      },
    }
  } else {
    // default text
    return {
      textInput: {
        label: field.label,
        type: field.textType || 'SINGLE_LINE',
        name: field.name,
      },
    }
  }
}
