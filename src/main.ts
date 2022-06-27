import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
// eslint-disable-next-line sort-imports
import * as PR from './pull_request'

async function run(): Promise<void> {
  try {
    const octokit = getOctokit(core.getInput('github_token'))

    const prNumber = PR.getPrNumber()
    if (!prNumber) {
      throw new Error('Can not get current PR number')
    }

    const pr = await PR.get(octokit, prNumber)

    const listPullRequest = await octokit.rest.pulls.list({
      ...context.repo,
      state: 'open',
      head: `${context.repo.owner}:${pr.head.ref}`
    })

    for (const pullRequest of listPullRequest.data) {
      const res = await PR.merge(octokit, {
        ...context.repo,
        number: pullRequest.number
      })

      if (!res) {
        await octokit.rest.issues.addLabels({
          ...context.repo,
          issue_number: prNumber,
          labels: ['conflict-merged']
        })
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
