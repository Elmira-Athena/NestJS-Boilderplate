import { Controller, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { UserService } from '@modules/user/user.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Delete("users/:id")
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
  async deleteUsers(@Param("id") id: number) {
    await this.userService.findOneById(id);
    await this.userService.deleteOne(id);
  }
}
