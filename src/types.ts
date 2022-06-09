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

export type MergePullRequestRequest = {
  owner: string
  repo: string
  number: number
}
