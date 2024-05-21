import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodObject } from 'zod';
import { createUserSchema } from '../../user/dto/create-user.dto';

export class FormdataValidation implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (error) {
      console.log('error===>  ', error);
      throw new BadRequestException('Validation failed');
    }
    console.log('extract ', value);
    return value;
  }
}
