import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.handleRegister(registerDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async validateUser(@Request() req) {
  //   return req.user;
  // }

  @Get('users')
  async getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.authService.getUsers(pageNumber, limitNumber);
  }
  @Public()
  @Post('create_user')
  create_user(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.create_user(createUserDto);
  }
  @Patch(':id')
  update_user(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return this.authService.update_user(id, updateUserDto);
  }
  @Delete(':id')
  delete_user(@Param('id') id: string) {
    return this.authService.delete_user(id);
  }
}
