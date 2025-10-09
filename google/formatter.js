
export class GoogleChatFormatter {

  constructor(textBuilder) {
    this.tb = textBuilder
  }

  toString() {
    return this.tb.toString()
  }

  toHTML() {
    let s = ''
    let i = 0
    for (let p of this.tb.parts) {
      if (p.type == "text") {
        i += p.text.length
        s += p.text
        continue
      }
      if (p.type === "link") {
        s += `<a href="${p.url}">${p.text}</a>`
      } else if (p.type === "mention") {
        s += p.text
      } else if (p.type === "hashtag") {
        s += p.text
      }
      i += p.text.length
    }
    return s
  }

}
