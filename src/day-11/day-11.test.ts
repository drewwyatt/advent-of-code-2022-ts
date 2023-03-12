import { describe, expect, test } from 'vitest'
import { toDescription } from './models'

const INPUT = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`.trim()

describe('part-1', () => {
  test('parsing', () => {
    const rawDescriptions = INPUT.split(/\n\s*\n/).filter(Boolean)
    const parsed = rawDescriptions.map(toDescription)
    expect(parsed.length).toEqual(4)
    expect(
      parsed.every(
        d =>
          typeof d.number === 'number' &&
          Array.isArray(d.startingItems) &&
          typeof d.operation === 'function' &&
          typeof d.test === 'function' &&
          typeof d.ifTrue === 'number' &&
          typeof d.ifFalse === 'number',
      ),
    )
  })

  describe('sanity-checks', () => {
    test.each([
      [1, [20, 23, 27, 26], [2080, 25, 167, 207, 401, 1046], [], []],
      [2, [6095, 10, 71, 135, 350], [43, 49, 58, 55, 362], [], []],
      [3, [16, 18, 21, 20, 122], [1468, 22, 150, 286, 739], [], []],
      [4, [491, 9, 52, 97, 248, 34], [, 39, 45, 43, 258], [], []],
      [5, [15, 17, 16, 88, 1037], [20, 110, 205, 524, 72], [], []],
      [6, [8, 70, 176, 26, 34], [481, 32, 36, 186, 2190], [], []],
      [7, [162, 12, 14, 64, 732, 17], [148, 372, 55, 72], [], []],
      [8, [51, 126, 20, 26, 136], [343, 26, 30, 1546, 36], [], []],
      [9, [116, 10, 12, 517, 14], [108, 267, 43, 55, 288], [], []],
      [10, [91, 16, 20, 98], [481, 245, 22, 26, 1092, 30], [], []],
      [15, [83, 44, 8, 184, 9, 20, 26, 102], [110, 36], [], []],
      [20, [10, 12, 14, 26, 34], [245, 93, 53, 199, 115], [], []],
    ])(
      `After round %i, the monkeys are holding items with these worry levels:`,
      (round, ...monkeys) => {},
    )

    // After round 15, the monkeys are holding items with these worry levels:
    // Monkey 0: 83, 44, 8, 184, 9, 20, 26, 102
    // Monkey 1: 110, 36
    // Monkey 2:
    // Monkey 3:
  })
})
