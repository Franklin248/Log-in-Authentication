
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ValidateIf(
    (_, value) =>
      typeof value === 'string' && value.trim() !== '',
  )
  @IsEmail()
  @MaxLength(150)
  email?: string | null;

  @IsString()
  @MinLength(8)
  password: string;
}
