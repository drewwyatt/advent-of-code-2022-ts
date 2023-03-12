import type { Description } from './description'

export class Monkey {
  number: number
  items: number[]
  #inspect: (worry: number) => number
  #getNextMonkey: (monkeys: Monkey[], worry: number) => Monkey

  constructor(description: Description) {
    this.number = description.number
    this.items = description.startingItems

    this.#inspect = description.operation
    this.#getNextMonkey = (monkeys: Monkey[], worry: number) => {
      const number = description.test(worry) ? description.ifTrue : description.ifFalse
      const monkey = monkeys[number]

      if (!monkey) {
        throw new Error(`Could not find monkey for number: "${number}"`)
      }

      return monkey
    }
  }

  playRound = (monkeys: Monkey[]) => {
    while (this.items.length) {
      let item = Math.floor(this.#inspect(this.items.shift()!))
      item = Math.floor(item / 3) // monkey gets bored

      const monkey = this.#getNextMonkey(monkeys, item)
      monkey.catch(item)
    }
  }

  catch(item: number) {
    this.items.push(item)
  }
}
