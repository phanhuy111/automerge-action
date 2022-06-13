export type GetPullRequestResponse = {
  number: number
  url: string
  title: string
  body: string | null
  head: {
    label: string
    ref: string
  }
}

export type CreatePullRequestRequest = {
  title: string
  head: string
  base: string
  body: string | null
  assignees: string[]
  labels: string[]
  reviewers: string[]
}

export type CreatePullRequestResponse = {
  number: number
  url: string
}

export type MergeRequest = {
  owner: string
  repo: string
  number: number
}

export type MergeResponse = {
  sha: string
  merged: boolean
  message: number
}