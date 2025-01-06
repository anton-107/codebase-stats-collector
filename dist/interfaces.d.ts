export interface Contributor {
    name: string;
    email?: string;
    timestamp: number;
}
export type ChangedFileType = "modify" | "add" | "remove" | "equal";
export interface ChangedFile {
    type: ChangedFileType;
    path: string;
    isExistingFile: boolean;
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
    oid: string;
    commit: Commit;
    changedFiles: ChangedFile[];
}
export interface Dashboard {
    displayDashboard(): string;
}
