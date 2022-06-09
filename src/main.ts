import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
// eslint-disable-next-line sort-imports
import * as PR from './pull_request'

async function run(): Promise<void> {
  try {
    // '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'
    const ownerGit = 'onpointvn'
    const repoGit = 'octosells'
    const octokit = getOctokit(core.getInput('github_token'))
    const branchPrefix = core.getInput('branch_prefix')

    const prNumber = PR.getPrNumber()
    if (!prNumber) {
      throw new Error('Can not get current PR number')
    }

    const pr = await PR.get(octokit, prNumber)

    const listPullRequest = await octokit.rest.pulls.list({
      owner: ownerGit,
      repo: repoGit,
      head: `onpointvn:${pr.head.ref}`
    })

    if (branchPrefix !== '*' && !pr.head.ref.startsWith(branchPrefix)) {
      return
    }

    for (const pullRequest of listPullRequest.data) {
      await PR.merge(octokit, {
        owner: ownerGit,
        repo: repoGit,
        number: pullRequest.number
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
