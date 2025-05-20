import { customerValueObjectsFixtures } from '@/fixtures/customer-fixtures';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';

describe('PhoneNumberVO', () => {
  // Fixtures & Stubs
  const { phoneNumber } = customerValueObjectsFixtures;
  const { valid, invalid, missing } = phoneNumber;

  const validationExceptionMessage = 'Invalid customer data, invalid phone number.';
  const requiredExceptionMessage = 'Invalid customer data, phone number is required.';

  describe('Given the attempts to create a PhoneNumberVO', () => {
    describe('When valid values are provided', () => {
      describe.each(Object.keys(valid))('And a phone number %s is specified', (inputKeyString) => {
        it('Should create a valid PhoneNumberVO ', () => {
          const input = valid[inputKeyString];
          const expectedResult = valid[inputKeyString].replace(/\D+/g, '');

          const createdEmailAddress = PhoneNumberVO.create(input);

          expect(createdEmailAddress).toBeInstanceOf(PhoneNumberVO);
          expect(createdEmailAddress.value).toBe(expectedResult);
        });
      });
    });

    describe('When invalid values are provided', () => {
      describe.each(Object.keys(invalid))('And a phone number %s is specified', (inputKeyString) => {
        it('should throw an InvalidInputDataException', () => {
          const input = invalid[inputKeyString];

          expect(() => PhoneNumberVO.create(input)).toThrow(validationExceptionMessage);
        });
      });
    });

    describe('When value is missing', () => {
      describe.each(Object.keys(missing))('And a phone number %s is specified', (inputKeyString) => {
        it('should throw an InvalidInputDataException', () => {
          const input = invalid[inputKeyString];

          expect(() => PhoneNumberVO.create(input)).toThrow(requiredExceptionMessage);
        });
      });
    });
  });

  describe('Given the attempts to compare two PhoneNumberVO', () => {
    describe('When equals phone numbers are provided', () => {
      it('Should return true to the comparison', () => {
        const { landlinePhone, landlinePhoneWithFormatting } = valid;
        const createdPhoneNumber1 = PhoneNumberVO.create(landlinePhone);
        const createdPhoneNumber2 = PhoneNumberVO.create(landlinePhoneWithFormatting);

        const result = createdPhoneNumber1.equals(createdPhoneNumber2);

        expect(result).toBeTruthy();
      });
    });

    describe('When distinct phone numbers are provided', () => {
      it('Should return false to the comparison', () => {
        const { mobilePhone, landlinePhoneWithFormatting } = valid;
        const createdPhoneNumber1 = PhoneNumberVO.create(mobilePhone);
        const createdPhoneNumber2 = PhoneNumberVO.create(landlinePhoneWithFormatting);

        const result = createdPhoneNumber1.equals(createdPhoneNumber2);

        expect(result).toBeFalsy();
      });
    });
  });
});
