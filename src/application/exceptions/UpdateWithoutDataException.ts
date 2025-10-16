export class UpdateWithoutDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateWithoutDataException';
  }
}