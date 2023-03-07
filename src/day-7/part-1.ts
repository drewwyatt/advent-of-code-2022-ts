export type DirectoryListing = {
  contents: Record<string, DirectoryListing>
  size: number
}

export const toDirectoryListing = (input: string): DirectoryListing => ({
  contents: {},
  size: 0,
})
