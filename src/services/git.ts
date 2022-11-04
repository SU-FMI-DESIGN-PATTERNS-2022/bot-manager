import { Octokit } from '@octokit/rest';
import HttpException from '../classes/HttpException';
import { DEPLOYMENT, GITHUB } from '../config/config';
import { GIT_URL } from '../constants';
import { Branch, BranchWithHistory, Commit, Tag, TaggedCommit } from '../interfaces/git';

const githubApp = new Octokit({
    auth: GITHUB.TOKEN
});

export const getGitTagData = async (): Promise<TaggedCommit> => {
    const BRANCH_NAME = DEPLOYMENT === 'DEV' ? GITHUB.DEVELOPMENT_BRANCH : GITHUB.DEFAULT_BRANCH;

    const allRemoteBranches = await getAllRemoteBranches();

    const targetBranch = getSpecificBranch(allRemoteBranches, BRANCH_NAME);

    const remoteTags = await getAllRemoteTags();

    const targetBranchWithCommitHistory = {
        branch: targetBranch,
        commitHistory: await getCommitsOfBranch(targetBranch)
    } as BranchWithHistory;

    return getLastTagFromCommits(remoteTags, targetBranchWithCommitHistory);
};

const getAllRemoteTags = async (): Promise<Tag[]> => {
    try {
        const tags = await githubApp.request(`${GIT_URL}/{tag_sha}`, {
            owner: GITHUB.REPO_OWNER,
            repo: GITHUB.REPO,
            tag_sha: 'tags'
        });

        return JSON.parse(JSON.stringify(tags.data));
    } catch (err: unknown) {
        throw new HttpException(404, `No tags could be found`);
    }
};

const getAllRemoteBranches = async (): Promise<Branch[]> => {
    try {
        return <Branch[]>(await githubApp.request(`${GIT_URL}/branches`, {
            owner: GITHUB.REPO_OWNER,
            repo: GITHUB.REPO
        })).data;
    } catch (err: unknown) {
        throw new HttpException(404, `No branches could be found for repository: ${GITHUB.REPO}. Verify the repository url is correct and the token provided is correct.`);
    }
};

const getCommitsOfBranch = async (targetBranch: Branch): Promise<Commit[]> => {
    try {
    return <Commit[]>(await githubApp.request(`${GIT_URL}/commits?per_page=${GITHUB.COMMITS_COUNT}&sha=${targetBranch.name}`, {
            owner: GITHUB.REPO_OWNER,
            repo: GITHUB.REPO
        })).data;
    } catch (err: unknown) {
        throw new HttpException(404, `No commits could be found for branch: ${targetBranch.name}`);
    }
};


const getSpecificBranch = (branches: Branch[], targetBranchName: string): Branch => {
    const branch = branches.find((i) => i.name === targetBranchName);
    if (branch !== undefined) {
        return branch;
    } else {
        throw new HttpException(404, `Branch: ${targetBranchName} could not be found.`);
    }
};

const getLastTagFromCommits = (tags: Tag[], targetBranch: BranchWithHistory): TaggedCommit => {
    for (let i = 0; i < tags.length; i++) {
        for (let j = 0; j < targetBranch.commitHistory.length; j++) {
            if (tags[i].commit.sha.toString() === targetBranch.commitHistory[j].sha.toString()) {
                return {
                    tag_name: tags[i].name,
                    tag_commit: tags[i].commit.sha,
                    tag_branch: targetBranch.branch.name,
                };
            }
        }
    }
    throw new HttpException(404, `There was no commit found with any tag for branch ${targetBranch.branch.name}`);
};
