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
    cycles: 2,
  } as const)

const noop = (_: RegExpExecArray) => ({ type: InstructionType.noop, cycles: 1 } as const)

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

type Mutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export class CPU {
  #cycles: number[] = [1]
  #instructions: Instruction[]

  constructor(instructions: Instruction[]) {
    this.#instructions = instructions
  }

  registerAtCycle(number: number) {
    while (!this.#cycles[number - 1]) {
      this.#run()
    }

    return this.#cycles[number - 1]
  }

  signalAtCycle(number: number) {
    return this.registerAtCycle(number) * number
  }

  #run() {
    const instruction = this.#instructions.shift() as Mutable<Instruction>
    if (!instruction) {
      throw new Error('No instrucitons to run')
    }

    // hold work until final cycle
    while (instruction.cycles > 1) {
      instruction.cycles--
      this.#cycles.push(this.#currentRegister)
    }

    switch (instruction.type) {
      case InstructionType.addx:
        this.#cycles.push(instruction.value + this.#currentRegister)
        break
      default:
        this.#cycles.push(this.#currentRegister)
        break
    }
  }

  get #currentRegister() {
    return this.#cycles[this.#cycles.length - 1]
  }
}
