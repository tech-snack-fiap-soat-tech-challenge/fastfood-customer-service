export class EntityDuplicatedException extends Error {
  constructor(entityName: string, field: string) {
    super(`${entityName} with the provided ${field} already exists.`);
    this.name = 'EntityDuplicatedException';
  }
}
