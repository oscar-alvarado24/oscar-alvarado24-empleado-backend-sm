export class BadPositionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadPositionException';
  }
}