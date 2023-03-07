class Directory {
  parent: Directory
  directories: Record<string, Directory> = {}
  #size: number | null = null
  #files: Record<string, number> = {}

  constructor(parent: Directory) {
    this.parent = parent
  }

  public static Root(): Directory {
    const dir: Directory = new (Directory as any)()
    dir.parent = dir // circular reference (can't go any higher than root)

    return dir
  }

  cd(...keys: string[]) {
    let cursor: Directory = this
    for (const key of keys) {
      cursor = cursor.directories[key] ??= new Directory(cursor)
    }

    return cursor
  }

  get size(): number {
    return (this.#size ??=
      this.#dirList.reduce((a, b) => a + b.size, 0) +
      this.#fileList.reduce((a, b) => a + b, 0))
  }

  get #dirList(): Directory[] {
    return Object.values(this.directories)
  }

  get #fileList(): number[] {
    return Object.values(this.#files)
  }
}

enum Command {
  cdChild,
  cdParent,
  cdRoot,
  ls,
}

enum Response {
  directory,
  file,
}

const matchers = {
  command: {
    [Command.cdChild]: /^\$ cd (?<dirname>\w+)/,
    [Command.cdParent]: /^\$ cd ../,
    [Command.cdRoot]: /^\$ cd \//,
    [Command.ls]: /^\$ ls/,
  },
  response: {
    [Response.directory]: /^dir (?<dirname>\w+)/,
    [Response.file]: /^(?<size>\d+) (?<name>[\w\.]+)/,
  },
}

export const toDirectoryListing = (input: string): Directory => Directory.Root()
