import {
  Controller,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { UserService } from '@modules/user/user.service';
import { UpdateProfileUser } from './dto/update-profile-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Delete('users/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'deleteUsers',
    summary: 'Delete user',
    description: 'Delete user',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successful',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to be deleted',
    type: 'integer',
  })
  @ApiBearerAuth('token')
  async deleteUsers(@Param('id') id: number) {
    await this.userService.findOneById(id);
    await this.userService.deleteOne(id);
  }

  @Put('users/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['admin'],
    operationId: 'editProfileUser',
    summary: 'Edit profile users by admin',
    description: 'Edit profile users by admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to be updated',
    type: 'integer',
  })
  @ApiBearerAuth('token')
  async updateProfileUser(
    @Body() data: UpdateProfileUser,
    @Param('id') id: number,
  ) {
    return await this.userService.updateProfileUserByAdmin(id, data);
  }
}
