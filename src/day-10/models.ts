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
    while (typeof this.#cycles[number - 1] != 'number') {
      this.#run(number)
    }

    return this.#cycles[number - 1]
  }

  signalAtCycle(number: number) {
    return this.registerAtCycle(number) * number
  }

  #run(requestedCycle: number) {
    const instruction = this.#instructions.shift() as Mutable<Instruction>
    if (!instruction) {
      const lastCycle = this.#cycles.length
      throw new Error(
        `No instrucitons to run (${requestedCycle} / ${lastCycle}) (requested / last)`,
      )
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

/*******
 * CRT *
 *******/

type Pixel = '#' | '.'

export class CRT {
  #cpu: CPU
  #rows: CRTRow[]

  constructor(cpu: CPU) {
    this.#cpu = cpu
    this.#rows = new Array(6).fill(null).map(() => new CRTRow())

    let cycle = 1
    while (this.#canDraw) {
      this.#draw(cycle)
      cycle++
    }
  }

  toString() {
    return this.#rows.map(row => row.toString()).join('\n')
  }

  #draw(cycle: number) {
    if (!this.#currentRow) throw new Error('No available rows')
    this.#currentRow.draw(this.#cpu.registerAtCycle(cycle) - 1)
  }

  get #currentRow() {
    return this.#rows.find(r => r.canDraw)
  }

  get #canDraw() {
    return this.#rows[this.#rows.length - 1].canDraw
  }
}

class CRTRow {
  #pixels: Pixel[] = []

  draw(spritePosition: number) {
    if (!this.canDraw) throw new Error('Cannot draw. Row full.')
    this.#pixels.push(this.#pixelForPosition(spritePosition))
  }

  toString() {
    return this.#pixels.join('')
  }

  get canDraw() {
    return this.#pixels.length < 40
  }

  get #cursorPosition() {
    return this.#pixels.length - 1
  }

  #pixelForPosition(spritePosition: number): Pixel {
    return this.#cursorPosition >= spritePosition - 1 &&
      this.#cursorPosition <= spritePosition + 1
      ? '#'
      : '.'
  }
}
