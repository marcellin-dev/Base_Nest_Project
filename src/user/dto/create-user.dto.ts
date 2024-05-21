import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

// export const createUserSchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().optional(),
//   })
//   .strict();
//
// //export type CreateUserDtoValidator = z.infer<typeof createUserSchema>;

export class createUserSchema {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
