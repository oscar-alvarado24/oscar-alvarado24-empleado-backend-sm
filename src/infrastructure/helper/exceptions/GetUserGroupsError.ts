export class GetUserGroupsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GetUserGroupsError";
        this.message = message;
    }
}