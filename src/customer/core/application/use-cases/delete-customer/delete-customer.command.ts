export class DeleteCustomerCommand {
  public readonly id: number;

  constructor(id: number) {
    this.id = id;
  }
}
