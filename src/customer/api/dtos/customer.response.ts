import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponse {
  @ApiProperty({ example: '12', description: `The customer's unique identifier` })
  id: number;

  @ApiProperty({ example: 'John Doe', description: `The customer's name` })
  name: string;

  @ApiProperty({ example: 'john.doe@acme.com', description: `The customer's email address` })
  email: string;

  @ApiProperty({ example: '(21) 9 9478-2338', description: `The customer's phone number` })
  phone: string;

  @ApiProperty({ example: '866.232.090-26', description: `The customer's CPF document number` })
  document: string;

  @ApiProperty({ example: '2025-05-17T02:52:56.723Z', description: `The date of customer's data registration` })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-17T02:52:56.723Z', description: `The date of last customer's data update` })
  updatedAt: Date;
}
