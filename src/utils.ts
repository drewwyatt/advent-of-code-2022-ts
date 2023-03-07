import fs from 'fs'
import path from 'path'
import url from 'url'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const readInputForDay = async (day: number): Promise<string> => {
  const result = await readFile(path.join(__dirname, `day-${day}`, 'INPUT.txt'), 'utf-8')
  return result.toString()
}
