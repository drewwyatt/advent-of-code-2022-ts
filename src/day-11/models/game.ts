import type { Description } from './description'
import { Monkey } from './monkey'

export class Game {
  round = 0
  #monkeys: Monkey[]

  constructor(descriptions: Description[]) {
    this.#monkeys = descriptions.map(d => new Monkey(d))
  }

  playRounds(numberOfRounds: number) {
    while (this.round < numberOfRounds) {
      this.round++

      for (const monkey of this.#monkeys) {
        monkey.playRound(this.#monkeys)
      }
    }
  }

  itemsForMonkey(number: number) {
    return this.#monkeys[number].items
  }
}
