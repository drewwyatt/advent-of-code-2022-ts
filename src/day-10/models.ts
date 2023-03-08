/*********
 * Input *
 *********/

export enum InstructionType {
  addx = 'addx',
  noop = 'noop',
}

const addx = (match: RegExpMatchArray) =>
  ({ type: InstructionType.addx, value: Number(match.groups!.value) } as const)

const noop = (_: RegExpExecArray) => ({ type: InstructionType.noop } as const)

export type Instruction = ReturnType<typeof addx | typeof noop>

const matchers = [
  [/^addx (?<value>-?\d+)$/, addx],
  [/^noop$/, noop],
] as const

export const toInstruction = (line: string): Instruction => {
  for (const [re, mapper] of matchers) {
    const match = re.exec(line)
    if (match) {
      return mapper(match)
    }
  }

  throw new Error(`Could not map line "${line}" to instruction`)
}
