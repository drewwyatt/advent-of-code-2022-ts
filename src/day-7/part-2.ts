import type { Directory } from './models'

export enum Space {
  total = 70000000,
  required = 30000000,
}

export const findSmallestDirectoryToDelete = (
  dir: Directory,
  usedSpace: number,
): Directory | null => {
  if (!wouldFreeEnoughSpace(dir, usedSpace)) return null

  const result = dir.subDirs.reduce(
    (smallestDir, next) =>
      wouldFreeEnoughSpace(next, usedSpace) && next.size < smallestDir.size
        ? next
        : smallestDir,
    dir,
  )

  return result !== dir ? findSmallestDirectoryToDelete(result, usedSpace) : result
}

const wouldFreeEnoughSpace = (dir: Directory, usedSpace: number) =>
  Space.total - usedSpace + dir.size >= Space.required
