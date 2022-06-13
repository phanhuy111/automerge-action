// eslint-disable-next-line filenames/match-regex
import * as core from '@actions/core'
import {context} from '@actions/github'
// eslint-disable-next-line sort-imports
import type {GitHub} from '@actions/github/lib/utils'
// eslint-disable-next-line sort-imports
import {
  CreatePullRequestRequest,
  CreatePullRequestResponse,
  GetPullRequestResponse,
  MergeRequest
} from './types'

export async function get(
  octokit: InstanceType<typeof GitHub>,
  number: number
): Promise<GetPullRequestResponse> {
  const response = await octokit.rest.pulls.get({
    owner: 'onpointvn',
    repo: 'octosells',
    pull_number: number
  })

  return response.data
}

export async function create(
  octokit: InstanceType<typeof GitHub>,
  pr: CreatePullRequestRequest
): Promise<CreatePullRequestResponse> {
  core.info(`create pull request: ${pr.head} to: ${pr.base}`)
  const response = await octokit.rest.pulls.create({
    ...context.repo,
    title: pr.title,
    base: pr.base,
    head: pr.head,
    body: pr.body || ''
  })
  const {html_url, number} = response.data

  core.info(`new pull request: ${html_url}`)

  if (pr.labels.length > 0 || pr.assignees.length > 0) {
    core.info(
      `add labels: ${pr.labels.join(',')}, assignees: ${pr.assignees.join(',')}`
    )
    await octokit.rest.issues.update({
      ...context.repo,
      issue_number: number,
      labels: pr.labels,
      assignees: pr.assignees
    })
  }

  if (pr.reviewers.length > 0) {
    core.info(`request reviewers: ${pr.reviewers.join(',')}`)
    await octokit.rest.pulls.requestReviewers({
      ...context.repo,
      pull_number: number,
      reviewers: pr.reviewers
    })
  }

  return {number, url: html_url}
}

export async function merge(
  octokit: InstanceType<typeof GitHub>,
  pr: MergeRequest
): Promise<boolean> {
  const response = await octokit.rest.pulls.merge({
    ...context.repo,
    pull_number: pr.number
  })

  const {merged} = response.data
  return merged
}

export function getPrNumber(): number | undefined {
  const pullRequest = context.payload.pull_request
  return pullRequest?.number
}
