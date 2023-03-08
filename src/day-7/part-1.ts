import { Directory } from './models'

export const findDirectoriesOfMaxSize = (maxSize: number, root: Directory) => {
  const acc = []

  if (root.size <= maxSize) {
    acc.push(root)
  }

  const children: Directory[] = root.subDirs.flatMap(dir =>
    findDirectoriesOfMaxSize(maxSize, dir),
  )

  return acc.concat(children)
}
