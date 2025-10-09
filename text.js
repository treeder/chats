/**
 * This is the main class to build text section.
 * Then use an output formatter to get the output for a particular service. 
 * 
 */
export class TextBuilder {

  parts = []

  constructor() {

  }

  text(s, opts = {}) {
    this.push({ type: "text", text: s })
  }

  link(text, url, opts = {}) {
    this.push({ type: "link", text: text, url: url })
  }

  mention(text, opts = {}) {
    this.push({ type: "mention", text: text })
  }

  hashtag(text, opts = {}) {
    this.push({ type: "hashtag", text: text })
  }

  push(part, opts = {}) {
    this.parts.push({ ...opts, ...part })
  }

  /**
   * 
   * @returns a basic string with no facets or anything
   */
  toString() {
    let s = ''
    let i = 0
    for (let p of this.parts) {
      // if (i > 0 && !p.noSpace) {
      //   s += ' '
      // }
      s += p.text
      i++
    }
    return s
  }


}