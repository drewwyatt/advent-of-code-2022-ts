export enum Command {
  cdChild = 'command:cdChild',
  cdParent = 'command:cdParent',
  cdRoot = 'command:cdRoot',
  ls = 'command:ls',
}

export enum Response {
  directory = 'response:directory',
  file = 'response:file',
}

type ParsedLine = ReturnType<
  | typeof cdChild
  | typeof cdParent
  | typeof cdRoot
  | typeof ls
  | typeof directoryResponse
  | typeof fileReponse
>

const cdChild = (match: RegExpMatchArray) =>
  ({
    type: Command.cdChild,
    value: match[0],
    args: { dirname: match.groups!.dirname },
  } as const)

const cdParent = (match: RegExpMatchArray) =>
  ({
    type: Command.cdParent,
    value: match[0],
  } as const)

const cdRoot = (match: RegExpExecArray) =>
  ({
    type: Command.cdRoot,
    value: match[0],
  } as const)

const ls = (match: RegExpExecArray) => ({ type: Command.ls, value: match[0] } as const)

const directoryResponse = (match: RegExpExecArray) =>
  ({
    type: Response.directory,
    value: match[0],
    args: { dirname: match.groups!.dirname },
  } as const)

const fileReponse = (match: RegExpMatchArray) =>
  ({
    type: Response.file,
    value: match[0],
    args: { size: Number(match.groups!.size), name: match.groups!.name },
  } as const)

const matchers: [regex: RegExp, mapper: (match: RegExpExecArray) => ParsedLine][] = [
  [/^\$ cd (?<dirname>\w+)/, cdChild],
  [/^\$ cd ../, cdParent],
  [/^\$ cd \//, cdRoot],
  [/^\$ ls/, ls],
  [/^dir (?<dirname>\w+)/, directoryResponse],
  [/^(?<size>\d+) (?<name>[\w\.]+)/, fileReponse],
]

export const parseLine = (line: string) => {
  for (const [matcher, constructor] of matchers) {
    const match = matcher.exec(line.trim())
    if (match) {
      return constructor(match)
    }
  }

  throw new Error(`Unable to parse line: "${line}"`)
}
