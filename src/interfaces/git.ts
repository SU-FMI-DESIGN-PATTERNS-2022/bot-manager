interface Commit {
    sha: string
}

interface Branch {
    name: string,
        commit: {
        sha: string
    }
}

interface BranchWithHistory {
    branch: Branch,
    commitHistory: Commit[]
}

interface TaggedCommit {
    tag_name: string,
    tag_commit: string,
    tag_branch: string,
}

interface Tag {
    name: string,
    commit: {
        sha: string,
    },
}

export { Commit, Branch, BranchWithHistory, TaggedCommit, Tag };

