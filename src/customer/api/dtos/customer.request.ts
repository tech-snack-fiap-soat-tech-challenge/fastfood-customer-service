import { ApiProperty } from '@nestjs/swagger';

export class CustomerRequest {
  //@IsString()
  //@IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: `The customer's name` })
  name: string;

  //@IsEmail()
  //@IsNotEmpty()
  @ApiProperty({ example: 'john.doe@acme.com', description: `The customer's email address` })
  email: string;

  //@IsPhoneNumber('BR')
  //@IsNotEmpty()
  @ApiProperty({ example: '(21) 9 9478-2338', description: `The customer's phone number` })
  phone: string;

  //@IsString()
  //@IsNotEmpty()
  @ApiProperty({ example: '866.232.090-26', description: `The customer's CPF document number` })
  document: string;
}
