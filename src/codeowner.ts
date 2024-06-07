import * as core from '@actions/core'
import ignore from 'ignore'

export interface CodeOwner {
  path: string
  username: string
  matcher: any
}

function ownerMatcher(path: string): any {
  const matcher = ignore().add(path)
  return matcher.ignores.bind(matcher)
}

export function parseCodeOwners(codeOwnersFile: string): CodeOwner[] {
  const codeOwners: CodeOwner[] = []
  for (const line of codeOwnersFile.split('\n')) {
    // Ignore empty lines and comments
    if (line.length === 0 || line.startsWith('#')) {
      continue
    }

    const [filepath, owner] = line.split(/\s+/)

    // Allow only owners in the form of @username
    if (!owner?.startsWith('@')) {
      continue
    }

    const codeOwner: CodeOwner = {
      path: filepath,
      username: owner.slice(1),
      matcher: ownerMatcher(filepath)
    }

    codeOwners.push(codeOwner)
  }

  return codeOwners.reverse()
}

// instead of iterating on the files, iterate on the codeowners and exclude files which match
// the codeowner path. This will be faster.
export function iterateOnCodeOwners(
  codeOwners: CodeOwner[],
  files: string[]
): string[] {
  const orphanedFiles: string[] = []
  const ignoreFiles = [
    'package.json',
    'yarn.lock',
    'poetry.lock',
    'pyproject.toml'
  ]
  for (const file of files) {
    if (ignoreFiles.includes(file)) continue // Skip iteration for ignored files
    const owner = getOwner(file, codeOwners)
    core.debug(`file ${file} has owner: ${owner}`)
    if (!owner) {
      orphanedFiles.push(file)
    }
  }

  core.debug(`final file list ${orphanedFiles}`)
  return orphanedFiles
}

export function getOwner(filePath: string, codeOwners: CodeOwner[]): string {
  for (const entry of codeOwners) {
    if (entry.matcher(filePath)) {
      return entry.username
    }
  }
  return ''
}
