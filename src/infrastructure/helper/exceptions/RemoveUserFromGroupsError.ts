export class RemoveUserFromGroupsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RemoveUserFromGroupsError';
        this.message = message;
    }
}