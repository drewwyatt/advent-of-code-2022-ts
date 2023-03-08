import { describe, test } from 'vitest'

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
    // The 20th cycle occurs in the middle of the second addx -1,
    // so the value of register X is the starting value, 1, plus all of the other addx values up to that point:
    // 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.
    test.todo(
      'During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420.',
    )

    test.todo(
      'During the 60th cycle, register X has the value 19, so the signal strength is 60 * 19 = 1140.',
    )

    test.todo(
      'During the 100th cycle, register X has the value 18, so the signal strength is 100 * 18 = 1800.',
    )

    test.todo(
      'During the 140th cycle, register X has the value 21, so the signal strength is 140 * 21 = 2940.',
    )

    test.todo(
      'During the 180th cycle, register X has the value 16, so the signal strength is 180 * 16 = 2880.',
    )

    test.todo(
      'During the 220th cycle, register X has the value 18, so the signal strength is 220 * 18 = 3960.',
    )
  })
})
