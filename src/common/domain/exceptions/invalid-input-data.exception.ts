export class InvalidInputDataException extends Error {
  constructor(entityName: string, validationMessage: string) {
    super(`Invalid ${entityName} data, ${validationMessage}.`);
    this.name = 'InvalidInputDataException.';
  }
}
