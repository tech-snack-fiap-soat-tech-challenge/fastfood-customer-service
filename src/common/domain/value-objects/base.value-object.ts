export abstract class BaseValueObject<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.validateProps(props);
    this.props = Object.freeze(props);
  }

  public getProps(): T {
    return this.props;
  }

  public equals(vo?: BaseValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  protected abstract validateProps(props: T): void;
}
