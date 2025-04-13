
export class CreateCognitoUserError extends Error {
  constructor(message: string) {       
    super(message);
    this.name = "CreateCognitoUserError";
    this.message = message;
  }
}