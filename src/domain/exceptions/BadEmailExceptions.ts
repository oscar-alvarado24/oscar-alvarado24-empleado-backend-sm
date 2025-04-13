export class BadEmailExceptions extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'BadEmailExceptions';
    }
  }