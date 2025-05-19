export class GetAllCustomersQuery {
  public readonly take: number;
  public readonly skip: number;

  constructor(props?: { take?: number; skip?: number }) {
    this.take = props?.take ?? 10;
    this.skip = props?.skip ?? 0;
  }
}
