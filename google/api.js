import { APIError } from 'api'
import { customAlphabet, nanoid } from 'nanoid'
import { verifyIdToken, getAccessToken } from 'web-auth-library/google'

/**
 * Usage:
 * 
 *  let chat = new GoogleChat({ creds: c.env.GOOGLE_CREDS, waitUntil: c.waitUntil })
    let spaceId = 'spaces/SPACE_ID'
    let r = await chat.postMessage(c, spaceId, {
      text: 'Hello world!',
    })
    console.log('RESPONSE:', r)
 */
export class GoogleChatAPI {
  constructor(options = {}) {
    this.options = options
    if (!(this.options.gCreds || this.options.creds)) throw new Error('Must provide your Google credentials')
    this.apiURL = `https://chat.googleapis.com/v1`

    this.nanoid = customAlphabet('1234567890abcdef')
  }

  async fetch(url, opts = {}) {
    const accessToken = await getAccessToken({
      credentials: this.options.gCreds || this.options.creds, // GCP service account key (JSON)
      scope: 'https://www.googleapis.com/auth/chat.messages',
      waitUntil: opts.waitUntil || this.options.waitUntil, // allows the token to be refreshed in the background
    })

    // url += `/${query.id}`
    opts.headers ||= {}
    opts.headers.Authorization = `Bearer ${accessToken}`
    if (opts.body) opts.body = JSON.stringify(opts.body)
    // console.log("URL:", url)
    // console.log("opts:", opts)
    const res = await fetch(url, opts)
    // console.log("RES:", res)
    const json = await res.json()
    // console.log("JSON:", json)
    if (!res.ok) {
      // these have string status codes like "INVALID_ARGUMENT", so converting to numbers
      // throw json.error || json[0].error
      let e = json.error || json[0].error
      throw new APIError(e.message, { status: e.code, data: { status: e.status } })
    }
    return json
  }

  /**
   * https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/patch#query-parameters
   *
   * @param {string} spaceId
   * @param {object} message
   * @param {object} opts
   */
  async postMessage(c, spaceId, message, opts = {}) {
    // this custom ID isn't really needed if we're posting async anyways.
    let mid = this.nanoid()
    let url = `${this.apiURL}/${spaceId}/messages?messageId=client-${mid}`
    let body = message
    let json = await this.fetch(url, { ...opts, ...{ method: 'POST', body } })
    // console.log('JSON:', json)
    return { message: json }
  }

  /**
   * https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/patch#query-parameters
   *
   * @param {string} messageId
   * @param {object} message
   * @param {object} opts
   */
  async updateMessage(c, messageId, message, opts = {}) {
    let url = `${this.apiURL}/${messageId}?updateMask=*`
    // console.log(url)
    let body = message
    let json = await this.fetch(url, { ...opts, ...{ method: 'PATCH', body } })
    // console.log('JSON:', json)
    return { message: json }
  }
}
