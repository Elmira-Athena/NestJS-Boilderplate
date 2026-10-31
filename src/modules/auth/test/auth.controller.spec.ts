import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { createUserStub } from '@modules/user/test/stubs/user.stub';
import { Response } from 'express';
import { isGuarded } from '@shared/test/utils';
import { LocalAuthGuard } from '../guard/local-auth.guard';

jest.mock('../auth.service.ts');
describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      // Arrange
      const authCredentialDto = {
        email: 'mockemail@gmail.com',
        password: '123456',
      };

      // Act
      const response = await authController.register(authCredentialDto);

      // Assert
      expect(response).toEqual({
        id: 1,
        email: 'mockemail@gmail.com',
      });
    });
  });

  describe('login', () => {
    it('should be guard by LocalAuthGuard', async () => {
      expect(isGuarded(AuthController.prototype.login, LocalAuthGuard)).toBe(
        true,
      );
    });

    it('should sign in and return access token', async () => {
      // Arrange
      const userStub = createUserStub();
      const authCredentialDto = {
        email: userStub.email,
        password: userStub.password,
      };
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      // Act
      const response = await authController.login(
        authCredentialDto,
        userStub,
        res,
      );

      // Assert
      expect(response).toEqual({
        email: 'mockemail@gmail.com',
        token: 'mocktoken',
        role: 2,
      });
    });
  });
});
