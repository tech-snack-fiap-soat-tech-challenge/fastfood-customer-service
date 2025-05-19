import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

export class GetCustomerByIdDocQuery {
  public readonly document: string;

  constructor(document: string) {
    this.document = document;
  }

  toValueObject(): DocumentNumberVo {
    return DocumentNumberVo.create(this.document);
  }
}
