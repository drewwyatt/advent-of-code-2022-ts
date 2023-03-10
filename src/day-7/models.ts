import { Command, Response, parseLine } from './input'

export class Directory {
  name: string
  parent: Directory
  #directories: Record<string, Directory> = {}
  #size: number | null = null
  #files: Record<string, number> = {}

  constructor(name: string, parent: Directory) {
    this.name = name
    this.parent = parent
  }

  static Root(): Directory {
    const dir: Directory = new (Directory as any)('/')
    dir.parent = dir // circular reference (can't go any higher than root)

    return dir
  }

  static From(input: string): Directory {
    const root = Directory.Root()
    let cursor = root

    for (const line of input.split('\n')) {
      if (!line) continue
      const result = parseLine(line)
      switch (result.type) {
        case Command.cdChild:
          cursor = cursor.cd(result.args.dirname)
          break
        case Command.cdParent:
          cursor = cursor.parent
          break
        case Response.file:
          cursor.addFile(result.args.name, result.args.size)
          break
        default:
      }
    }

    return root
  }

  cd(...keys: string[]) {
    let cursor: Directory = this
    for (const key of keys) {
      cursor = cursor.#directories[key] ??= new Directory(key, cursor)
    }

    return cursor
  }

  addFile(name: string, size: number) {
    this.#files[name] = size
  }

  get size(): number {
    return (this.#size ??=
      this.subDirs.reduce((a, b) => a + b.size, 0) +
      this.#fileList.reduce((a, b) => a + b, 0))
  }

  get subDirs(): Directory[] {
    return Object.values(this.#directories)
  }

  get #fileList(): number[] {
    return Object.values(this.#files)
  }
}
