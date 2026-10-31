import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { PageDto } from '@core/pagination/dto/page.dto';
import { User } from '@database/typeorm/entities';
import { AuthenticateGuard } from '@modules/auth/guard/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorator/user.decorator';
import { UserService } from './user.service';
import { UpdateProfileInfo } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @AuthenticateGuard()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['user'],
    operationId: 'getMe',
    summary: 'Get current user',
    description: 'Get current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async getMe(@CurrentUser('id') id: number): Promise<Partial<User>> {
    return this.userService.getMe(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['user'],
    operationId: 'getAllUser',
    summary: 'Get all user',
    description: 'Get all user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: PageDto,
  })
  async findMany(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.findAll(pageOptionsDto);
  }

  @Put()
  @AuthenticateGuard()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['user'],
    operationId: 'Edit profile info by user',
    summary: 'Edit profile info by user',
    description: 'Edit profile info by user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async updateProfileInfo(
    @Body() data: UpdateProfileInfo,
    @CurrentUser('id') id: number,
  ) {
    return this.userService.updateProfileInfo(id, data);
  }
}
