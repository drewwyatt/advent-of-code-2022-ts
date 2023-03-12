import { beforeAll, describe, expect, test } from 'vitest'
import { readInputForDay } from '../utils'
import { CPU, CRT, Instruction, toInstruction } from './models'

const INPUT = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`

describe('part-1', () => {
  describe('sanity checks', () => {
    let instructions: Instruction[]
    let subject: CPU
    beforeAll(() => {
      instructions = INPUT.split('\n').filter(Boolean).map(toInstruction)
      subject = new CPU(instructions)
    })

    // The 20th cycle occurs in the middle of the second addx -1,
    // so the value of register X is the starting value, 1, plus all of the other addx values up to that point:
    // 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.
    test('During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420.', () => {
      expect(subject.registerAtCycle(20)).toEqual(21)
      expect(subject.signalAtCycle(20)).toEqual(420)
    })

    test.each([
      [60, 19, 1140],
      [100, 18, 1800],
      [140, 21, 2940],
      [180, 16, 2880],
      [220, 18, 3960],
    ])(
      `During the %ith cycle, register X has the value %i, so the signal strength is %i`,
      (cycle, reg, sig) => {
        expect(subject.registerAtCycle(cycle)).toEqual(reg)
        expect(subject.signalAtCycle(cycle)).toEqual(sig)
      },
    )
  })

  // Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles.
  // What is the sum of these six signal strengths?
  test('main', async () => {
    const input = await readInputForDay(10)
    const instructions = input.split('\n').filter(Boolean).map(toInstruction)
    const cpu = new CPU(instructions)
    const sum = [20, 60, 100, 140, 180, 220].reduce((a, b) => a + cpu.signalAtCycle(b), 0)

    expect(sum).toEqual(14920)
  })
})

describe('part-2', () => {
  const SANITY_IMAGE = `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`.trim()

  const MAIN_IMAGE = `
###..#..#..##...##...##..###..#..#.####.
#..#.#..#.#..#.#..#.#..#.#..#.#..#....#.
###..#..#.#....#..#.#....###..#..#...#..
#..#.#..#.#....####.#....#..#.#..#..#...
#..#.#..#.#..#.#..#.#..#.#..#.#..#.#....
###...##...##..#..#..##..###...##..####.`.trim()

  test('sanity check', () => {
    const instructions = INPUT.split('\n').filter(Boolean).map(toInstruction)
    const cpu = new CPU(instructions)
    const crt = new CRT(cpu)

    expect(crt.toString()).toEqual(SANITY_IMAGE)
  })

  test('main', async () => {
    const input = await readInputForDay(10)
    const instructions = input.split('\n').filter(Boolean).map(toInstruction)
    const cpu = new CPU(instructions)
    const crt = new CRT(cpu)

    expect(crt.toString()).toEqual(MAIN_IMAGE)
  })
})
