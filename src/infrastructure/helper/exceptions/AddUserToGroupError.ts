export class AddUserToGroupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AddUserToGroupError";
    this.message = message;
  }
}