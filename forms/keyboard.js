export class KeyboardBuilder {
  perRow = 3
  keyboard = []
  row = []
  count = 0

  constructor(opts = {}) {
    // console.log("FIELDS")
    for (const f in this) {
      // console.log("F:", f, this[f])
      if (this.hasOwnProperty(f) && opts[f]) {
        this[f] = opts[f]
      }
      // console.log(this[f])
    }
  }

  // will take up an entire row
  pushRow(item) {
    this.keyboard.push([item])
  }

  push(item) {
    this.row.push(item)
    this.count++
    if (this.row.length == this.perRow) {
      // console.log("PUSHING ROW", this.row)
      this.keyboard.push(this.row)
      this.row = []
      this.count = 0
    }
  }

  build() {
    if (this.row.length > 0) {
      this.keyboard.push(this.row)
    }
    return this.keyboard
  }

}
