import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'Email', // Map to 'Email' in LoginDto
      passwordField: 'Password', // Map to 'Password' in LoginDto
    });
  }

  async validate(Email: string, Password: string): Promise<any> {
    const loginDto = { Email, Password }; // Map fields to LoginDto
    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('kiem tra lai email va mat khau');
    }

    return user; // Passport attaches user to the request
  }
}
