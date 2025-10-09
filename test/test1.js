import { assert } from 'testkit'

export async function test1(c) {

  let { api } = c.data
  console.log("Running test1")

  assert(true, 'Initial assertion')

  return {
    name: 'johnny',
  }
}