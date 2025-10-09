import { assert } from 'testkit'
import { TextBuilder } from '../text.js'

export async function test1(c) {

  let tb = new TextBuilder()
  tb.text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur cursus, nisl erat dictum urna, at cursus enim erat eu urna. Mauris ac velit nec urna facilisis tincidunt.`)
  tb.link("appoxy", "https://appoxy.com", { noSpace: true })
  tb.text(`\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur cursus, nisl erat dictum urna, at cursus enim erat eu urna. Mauris ac velit nec urna facilisis tincidunt.`)
  tb.link("yahoo", "https://yahoo.com")
  tb.hashtag("#ai")
  tb.mention("@john")
}