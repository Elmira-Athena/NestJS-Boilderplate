import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Res,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterResponse } from './response/register.response';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { LoginResponse } from './response/login.response';
import { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';
import { UserResponeDto } from '@modules/user/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from './dto/auth-create.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'register',
    summary: 'Register',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterResponse,
  })
  async register(@Body() data: CreateAuthDto): Promise<RegisterResponse> {
    return this.authService.registerUser(data);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginResponse,
  })
  async login(
    @Body() body: AuthCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const data = await this.authService.login(body);
    res.cookie('token', data.access_token);
    return data;
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'profile',
    summary: 'Profile',
    description: 'Profile',
  })
  @Get('profile')
  @ApiBearerAuth('token')
  async getProfileUser(@Request() req): Promise<UserResponeDto> {
    return plainToInstance(
      UserResponeDto,
      await this.authService.getUserById(req.user['userId']),
    );
  }
}
