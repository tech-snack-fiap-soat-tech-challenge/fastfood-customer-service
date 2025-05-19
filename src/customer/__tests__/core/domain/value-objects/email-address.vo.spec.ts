import { customerValueObjectsFixtures } from '@/fixtures/customer-fixtures';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';

describe('EmailAddressVO', () => {
  // Fixtures & Stubs
  const { emailAddress } = customerValueObjectsFixtures;
  const { valid, invalid } = emailAddress;

  const validationExceptionMessage = 'Invalid customer data, invalid email address.';

  describe('Given the attempts to create an EmailAddressVO', () => {
    describe('When valid values are provided', () => {
      describe.each(Object.keys(valid))('And an email address %s is specified', (inputKeyString) => {
        it('Should create a valid EmailAddressVO ', () => {
          const input = valid[inputKeyString];

          const createdEmailAddress = EmailAddressVO.create(input);

          expect(createdEmailAddress).toBeInstanceOf(EmailAddressVO);
          expect(createdEmailAddress.value).toBe(input);
        });
      });
    });

    describe('When invalid values are provided', () => {
      describe.each(Object.keys(invalid))('And an email address %s is specified', (inputKeyString) => {
        it('should throw an InvalidInputDataException', () => {
          const input = invalid[inputKeyString];

          expect(() => EmailAddressVO.create(input)).toThrow(validationExceptionMessage);
        });
      });
    });
  });

  describe('Given the attempts to compare two EmailAddressVO', () => {
    describe('When equals email addresses are provided', () => {
      it('Should return true to the comparison', () => {
        const { withRegularText } = valid;
        const createdEmailAddress1 = EmailAddressVO.create(withRegularText);
        const createdEmailAddress2 = EmailAddressVO.create(withRegularText);

        const result = createdEmailAddress1.equals(createdEmailAddress2);

        expect(result).toBeTruthy();
      });
    });

    describe('When distinct email addresses are provided', () => {
      it('Should return false to the comparison', () => {
        const { withRegularText, withAlias } = valid;
        const createdEmailAddress1 = EmailAddressVO.create(withRegularText);
        const createdEmailAddress2 = EmailAddressVO.create(withAlias);

        const result = createdEmailAddress1.equals(createdEmailAddress2);

        expect(result).toBeFalsy();
      });
    });
  });
});
