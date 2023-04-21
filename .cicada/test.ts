import { Job, Pipeline } from 'https://deno.land/x/cicada@v0.1.38/mod.ts'

const job = new Job({
  name: 'Run Tests',
  image: 'node:latest',
  steps: [
    {
      name: 'Install Deps',
      run: 'npm i -g pnpm && pnpm install',
    },
    {
      name: 'Run Tests',
      run: 'pnpm run test --run',
    },
  ],
})

export default new Pipeline([job])
