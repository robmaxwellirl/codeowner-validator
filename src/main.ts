import * as core from '@actions/core'
import * as github from '@actions/github'

import { parseCodeOwners, iterateOnCodeOwners } from './codeowner'

const codeownersFile = 'CODEOWNERS'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token')
    core.info(`Token: ${token}`)
    const octokit = github.getOctokit(token)

    const { owner, repo } = github.context.repo

    const { data: codeOwnersData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: codeownersFile,
      ref: github.context.ref
    })

    // Check that the API returned the contents of the CODEOWNERS file
    if (!('content' in codeOwnersData)) {
      core.setFailed(`No CODEOWNERS file found`)
      return
    }

    const codeOwnersFile = Buffer.from(
      codeOwnersData.content,
      'base64'
    ).toString()

    const codeOwners = parseCodeOwners(codeOwnersFile)

    for (const codeOwner of codeOwners) {
      core.debug(`Path: ${codeOwner.path}, Owner: ${codeOwner.username}`)
    }

    //list all files in the repo.
    const files = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: github.context.ref,
      recursive: 'true'
    })

    const fileList: string[] = []
    for (const file of files.data.tree) {
      if (file?.type !== 'tree') {
        fileList.push(`${file.path}`)
      }
    }

    const orphanedCodeownerFiles = iterateOnCodeOwners(codeOwners, fileList)
    const formattedFileList = orphanedCodeownerFiles.join('\n')
    core.notice(`Orphaned files: \n${formattedFileList}`)
  } catch (error) {
    core.setFailed(`Errors were found while running the action: ${error}`)
  }
}
