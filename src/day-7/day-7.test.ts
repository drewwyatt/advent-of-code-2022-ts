import { describe, expect, test } from 'vitest'
import { readInputForDay } from '../utils'
import { Directory } from './models'

import { findDirectoriesOfMaxSize } from './part-1'
import { Space, findSmallestDirectoryToDelete } from './part-2'

const INPUT = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`

const subject = () => Directory.From(INPUT)
/**
 * Given the commands and output in the example above, you can determine that the filesystem looks visually like this:
 *
 * - / (dir)
 *   - a (dir)
 *     - e (dir)
 *       - i (file, size=584)
 *     - f (file, size=29116)
 *     - g (file, size=2557)
 *     - h.lst (file, size=62596)
 *   - b.txt (file, size=14848514)
 *   - c.dat (file, size=8504156)
 *   - d (dir)
 *     - j (file, size=4060174)
 *     - d.log (file, size=8033020)
 *     - d.ext (file, size=5626152)
 *     - k (file, size=7214296)
 */

describe('part-1', () => {
  describe('sanity checks', () => {
    //  The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
    test('directory e has a total size of 584...', () =>
      expect(subject().cd('a', 'e').size).toEqual(584))

    // The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
    test('directory a has total size 94853...', () =>
      expect(subject().cd('a').size).toEqual(94853))

    // Directory d has total size 24933642.
    test('directory d has total size 24933642...', () =>
      expect(subject().cd('d').size).toEqual(24933642))

    // As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
    test('root has a total size of 48381165...', () =>
      expect(subject().size).toEqual(48381165))
  })

  // Find all of the directories with a total size of at most 100000.
  // What is the sum of the total sizes of those directories?
  test('main', async () => {
    const input = await readInputForDay(7)
    const root = Directory.From(input)

    const matchedDirs = findDirectoriesOfMaxSize(100000, root)
    const sum = matchedDirs.reduce((a, b) => a + b.size, 0)

    expect(sum).toEqual(1749646)
  })
})

describe('part-2', () => {
  describe('sanity checks', () => {
    test('deletes directory "d"', () => {
      const root = subject()
      const deletedDir = findSmallestDirectoryToDelete(root, root.size)

      expect(deletedDir?.name).toEqual('d')
      expect(deletedDir?.size).toEqual(24933642)
    })
  })

  test('main', async () => {
    const input = await readInputForDay(7)
    const root = Directory.From(input)
    const deletedDir = findSmallestDirectoryToDelete(root, root.size)

    expect(deletedDir?.size).toEqual(1498966)
  })
})
