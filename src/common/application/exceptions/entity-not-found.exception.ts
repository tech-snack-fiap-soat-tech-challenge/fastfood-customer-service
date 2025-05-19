export class EntityNotFoundException extends Error {
  constructor(entityName: string, fieldName: string, identifier: string | number) {
    super(`${entityName} with ${fieldName} ${identifier} was not found.`);
    this.name = 'EntityNotFoundException';
  }
}
