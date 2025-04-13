import validator from 'validator';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = validator.normalizeEmail(email) || email;
  }

  static create(email: string): Email {
    return new Email(email);
  }

  private static isValid(email: string): boolean {
    return validator.isEmail(email, {
      allow_utf8_local_part: true,
      require_tld: true
    });
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}