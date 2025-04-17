export class DeleteUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DeleteUserError";
        this.message = message;
    }
}