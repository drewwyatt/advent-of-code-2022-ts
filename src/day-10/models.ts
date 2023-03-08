/*********
 * Input *
 *********/

export enum InstructionType {
  addx = 'addx',
  noop = 'noop',
}

const addx = (match: RegExpMatchArray) =>
  ({
    type: InstructionType.addx,
    value: Number(match.groups!.value),
    additionalCycles: 1,
  } as const)

const noop = (_: RegExpExecArray) =>
  ({ type: InstructionType.noop, additionalCycles: 0 } as const)

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

/*******
 * CPU *
 *******/

type QueuedCycle = {
  register?: number
  instructions: Instruction[]
}

type Cycle = { register: number; instructions?: Instruction[] }

const firstCycle: Cycle = { register: 1 }
const toQueuedCycle = (
  currentCycle: QueuedCycle | undefined,
  instruction: Instruction | null = null,
): QueuedCycle => {
  let cycle = currentCycle ?? { instructions: [] }
  cycle.instructions ??= []

  if (instruction) {
    cycle.instructions.push(instruction)
  }

  return cycle
}

export class CPU {
  #cycles: Cycle[]

  constructor(instructions: Instruction[]) {
    this.#cycles = this.#instructionsToCycles(instructions)
  }

  registerAtCycle(number: number) {
    return this.#cycles[number - 1].register
  }

  signalAtCycle(number: number) {
    return this.registerAtCycle(number) * number
  }

  #instructionsToCycles(instructions: Instruction[]): Cycle[] {
    return instructions.reduce<QueuedCycle[]>(
      (acc: QueuedCycle[], instruction, index) => {
        acc = this.#queueInstruction(acc, instruction, index)
        acc = this.#processInstruction(acc, index)

        return acc
      },
      [firstCycle] as QueuedCycle[],
    ) as Cycle[]
  }

  #queueInstruction(
    cycles: QueuedCycle[],
    instruction: Instruction,
    cycleIndex: number,
  ): QueuedCycle[] {
    const index = cycleIndex + instruction.additionalCycles
    cycles[index] = toQueuedCycle(cycles[cycleIndex], instruction)

    return cycles
  }

  #processInstruction(cycles: QueuedCycle[], curIndex: number): QueuedCycle[] {
    if (curIndex === 0) return cycles

    cycles[curIndex] ??= { instructions: [] }
    const instructions = cycles[curIndex].instructions
    let register = (cycles as any as Cycle[])[curIndex - 1].register

    for (const instruction of instructions) {
      switch (instruction?.type) {
        case InstructionType.addx:
          register += instruction.value
          break
      }
    }

    cycles[curIndex].register = register
    return cycles
  }
}
