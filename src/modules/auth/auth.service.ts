import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from 'src/modules/auth/entities/profile.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { v4 as uuidv4 } from 'uuid';
import { HttpsMessage, HttpsStatus } from 'src/global/globalEnum';
import { BadRequestException } from '@nestjs/common';
import { formatDate } from 'src/utils/formatData';
import { ResponseData } from 'src/global/globalClass';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update_user.dto';
import { LoginDto } from './dto/login.dto';
import {
  hashedPassword,
  hashedPasswordCompare,
} from 'src/utils/formatPasswork';
import { RegisterDto } from './dto/register.dto';
const dayjs = require('dayjs');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService
  ) {}
  handleRegister = async (registerDto: RegisterDto) => {
    // Kiểm tra email đã tồn tại
    const email = await this.profileRepository.findOne({
      where: { Email: registerDto.Email },
    });

    if (email) {
      throw new BadRequestException(` ${registerDto.Email}  đã tồn tại`);
    }
    //hashPassword
    const hashedPwd = await hashedPassword(registerDto.Password);
    const newUser = this.profileRepository.create({
      ...registerDto,
      isVerified: false, // Updated based on Profile entity
      code_id: uuidv4(),
      Password: hashedPwd,
      code_expired: dayjs().add(1, 'year').toDate(), // Ensure type compatibility
      CreateDate: new Date(),
    });

    try {
      const savedUser = await this.profileRepository.save(newUser);

      // Exclude sensitive fields before returning the response
      const { Password, ...userWithoutPassword } = savedUser;

      return new ResponseData<any>(
        userWithoutPassword,
        HttpsStatus.SUCCESS,
        'User created successfully.'
      );
    } catch (error) {
      console.error('Error saving user:', error);

      return new ResponseData<null>(
        null,
        HttpsStatus.ERROR,
        'Error creating user.'
      );
    }
  };
  async login(user: Profile) {
    const payload = { Email: user.Email, sub: user.id };
    const { Password, ...users } = user;
    return new ResponseData<any>(
      {
        access_token: this.jwtService.sign(payload),
      },
      HttpsStatus.SUCCESS,
      'Sign in successfully.'
    );
  }
  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.profileRepository.findOne({
      where: { Email: loginDto.Email },
    });
    const comparePassWord = await hashedPasswordCompare(
      loginDto.Password,
      user.Password
    );
    if (!user || !comparePassWord) {
      return null;
    }
    return user;
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.profileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: [
        'id',
        'FullName',
        'Email',
        'CompanyName',
        'Address',
        'ImgUser',
        'ImgCover',
        'isVerified',
        'isAdmin',
        'account_type',
        'code_expired',
        'code_id',
        'CreateDate',
      ],
    });

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
  async create_user(createUserDto: CreateUserDto) {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.profileRepository.findOne({
      where: { Email: createUserDto.Email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }
    const hashedPwd = await hashedPassword(createUserDto.Password);
    const newUser = this.profileRepository.create({
      ...createUserDto,
      Password: hashedPwd,
      id: uuidv4(),
      CreateDate: formatDate(new Date()),
    });

    try {
      const savedUser = await this.profileRepository.save(newUser);
      return new ResponseData<Profile>(
        savedUser,
        HttpsStatus.SUCCESS,
        'User created successfully.'
      );
    } catch (error) {
      console.error('Error saving user:', error);
      return new ResponseData<null>(
        null,
        HttpsStatus.ERROR,
        'Error creating user.'
      );
    }
  }
  async update_user(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Find the user first to make sure it exists
      const user = await this.profileRepository.findOne({ where: { id } });

      if (!user) {
        return new ResponseData<null>(
          null,
          HttpsStatus.ERROR,
          'User not found.'
        );
      }
      if (updateUserDto.Password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.Password, 10); // 10 is the saltRounds
        updateUserDto.Password = hashedPassword;
      }
      // Update user details
      await this.profileRepository.update(id, { ...updateUserDto });

      // Optionally, get the updated user after saving it to return it
      const updatedUser = await this.profileRepository.findOne({
        where: { id },
      });

      return new ResponseData<Profile>(
        updatedUser,
        HttpsStatus.SUCCESS,
        'Update user successfully.'
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return new ResponseData<null>(
        null,
        HttpsStatus.ERROR,
        'Error updating user.'
      );
    }
  }
  async delete_user(id: string) {
    const id_user = await this.profileRepository.findOne({ where: { id } });

    if (!id_user) {
      return HttpsStatus.ERROR, 'Account  not found.';
    }
    try {
      this.profileRepository.delete(id);
      return new ResponseData<Profile>(
        null,
        HttpsStatus.SUCCESS,
        'Delete successfully'
      );
    } catch (error) {
      console.error('Error saving user:', error);
      return new ResponseData<null>(
        null,
        HttpsStatus.ERROR,
        'Error delete user.'
      );
    }
  }
}
