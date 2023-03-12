// class Monkey {
//   items: number[]
//   #operation: (item: number) => number
//   #test: (item: number) => boolean
// }

type Description = {
  number: number
  startingItems: number[]
  operation: (worry: number) => number
  test: (worry: number) => boolean
  ifTrue: number
  ifFalse: number
}

const matchers = [
  [
    /^Monkey (?<number>\d+):$/,
    (match: RegExpMatchArray) =>
      ({ type: 'number', value: Number(match.groups!.number) } as const),
  ],
  [
    /^\s+Starting items: (?<items>\d+(?:,\s\d+)*)$/,
    (match: RegExpMatchArray) =>
      ({
        type: 'startingItems',
        value: match.groups!.items.split(', ').map(n => Number(n)),
      } as const),
  ],
  [
    /^\s+Operation: new = old (?<operator>[+\*]) (?<arg>\d+|old)$/,
    (match: RegExpMatchArray) =>
      ({
        type: 'operation',
        value: {
          operator: match.groups!.operator,
          arg: match.groups!.arg === 'old' ? 'old' : Number(match.groups!.arg),
        },
      } as const),
  ],
  [
    /^\s+Test: divisible by (?<value>\d+)$/,
    (match: RegExpMatchArray) =>
      ({
        type: 'test',
        value: Number(match.groups!.value),
      } as const),
  ],
  [
    /^\s+If true: throw to monkey (?<value>\d+)$/,
    (match: RegExpMatchArray) =>
      ({
        type: 'ifTrue',
        value: Number(match.groups!.value),
      } as const),
  ],
  [
    /^\s+If false: throw to monkey (?<value>\d+)$/,
    (match: RegExpMatchArray) =>
      ({
        type: 'ifFalse',
        value: Number(match.groups!.value),
      } as const),
  ],
] as const

export const toDescription = (rawDescription: string) => {
  const descriptors = rawDescription.split('\n').map(line => {
    for (const [matcher, constructor] of matchers) {
      const match = matcher.exec(line)
      if (match) {
        return constructor(match)
      }
    }

    throw new Error(`No matcher found for line: "${line}"`)
  })

  const desc = {} as Description
  for (const description of descriptors) {
    switch (description.type) {
      case 'operation':
        desc.operation = toOperation(description)
        break
      case 'test':
        desc.test = (worry: number) => worry % description.value === 0
        break
      default:
        desc[description.type] = description.value as any // TODO
    }
  }

  return desc
}

const add = (a: number, b: number) => a + b
const mult = (a: number, b: number) => a * b

const toOperation = (
  descriptor: Extract<ReturnType<(typeof matchers)[number][1]>, { type: 'operation' }>,
) => {
  const op = descriptor.value.operator === '+' ? add : mult
  return (worry: number) => {
    const arg = descriptor.value.arg === 'old' ? worry : descriptor.value.arg
    return op(worry, arg)
  }
}
