export interface Contributor {
    name: string;
    email?: string;
    timestamp: number;
}
export interface ChangedFile {
    type: "modify" | "add" | "remove" | "equal";
    path: string;
}
export interface Commit {
    oid: string;
    commit: {
        message: string;
        author: Contributor;
        committer: Contributor;
    };
    payload: string;
}
export interface ExpandedCommit {
    commit: Commit;
    changedFiles: ChangedFile[];
}
