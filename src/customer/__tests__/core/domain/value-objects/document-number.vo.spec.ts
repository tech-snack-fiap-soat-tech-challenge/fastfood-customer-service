import { customerValueObjectsFixtures } from '@/fixtures/customer-fixtures';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

describe('DocumentNumberVO', () => {
  // Fixtures & Stubs

  const { documentNumber } = customerValueObjectsFixtures;
  const { valid, invalid, missing } = documentNumber;

  const validationExceptionMessage = 'Invalid customer data, invalid document number.';
  const requiredExceptionMessage = 'Invalid customer data, document number is required.';

  describe('Given the attempts to create a DocumentNumberVO', () => {
    describe('When valid values are provided', () => {
      describe.each(Object.keys(valid))('And a document number %s is specified', (inputKeyString) => {
        it('Should create a valid DocumentNumberVO', () => {
          const input = valid[inputKeyString];
          const expectedResult = valid[inputKeyString].replace(/\D+/g, '');

          const createdDocumentNumber = DocumentNumberVo.create(input);

          expect(createdDocumentNumber).toBeInstanceOf(DocumentNumberVo);
          expect(createdDocumentNumber.value).toBe(expectedResult);
        });
      });
    });

    describe('When invalid values are provided', () => {
      describe.each(Object.keys(invalid))('And a document number %s is specified', (inputKeyString) => {
        it('should throw an InvalidInputDataException', () => {
          const input = invalid[inputKeyString];

          expect(() => DocumentNumberVo.create(input)).toThrow(validationExceptionMessage);
        });
      });
    });

    describe('When value is missing', () => {
      describe.each(Object.keys(missing))('And a document number %s is specified', (inputKeyString) => {
        it('should throw an InvalidInputDataException', () => {
          const input = invalid[inputKeyString];

          expect(() => DocumentNumberVo.create(input)).toThrow(requiredExceptionMessage);
        });
      });
    });
  });

  describe('Given the attempts to compare two DocumentNumberVO', () => {
    describe('When equals document numbers are provided', () => {
      it('Should return true to the comparison', () => {
        const { digitsOnly, withFormatting } = valid;
        const createdDocumentNumber1 = DocumentNumberVo.create(digitsOnly);
        const createdDocumentNumber2 = DocumentNumberVo.create(withFormatting);

        const result = createdDocumentNumber1.equals(createdDocumentNumber2);

        expect(result).toBeTruthy();
      });
    });

    describe('When distinct document numbers are provided', () => {
      it('should return false to the comparison', () => {
        const { digitsOnly, alternativeWithFormatting } = valid;
        const createdDocumentNumber1 = DocumentNumberVo.create(digitsOnly);
        const createdDocumentNumber2 = DocumentNumberVo.create(alternativeWithFormatting);

        const result = createdDocumentNumber1.equals(createdDocumentNumber2);

        expect(result).toBeFalsy();
      });
    });
  });
});
