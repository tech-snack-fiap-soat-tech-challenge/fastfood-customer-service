import { ApiProperty } from '@nestjs/swagger';

export class CustomerRequest {
  @ApiProperty({ example: 'John Doe', description: `The customer's name` })
  name: string;

  @ApiProperty({ example: 'john.doe@acme.com', description: `The customer's email address` })
  email: string;

  @ApiProperty({ example: '(21) 9 9478-2338', description: `The customer's phone number` })
  phone: string;

  @ApiProperty({ example: '866.232.090-26', description: `The customer's CPF document number` })
  document: string;
}
