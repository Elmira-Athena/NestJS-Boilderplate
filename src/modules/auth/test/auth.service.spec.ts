import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { Repository } from 'typeorm';
import { User } from '@database/typeorm/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockConfigService } from './mocks/config-service.mock';
import { mockJwtService } from './mocks/jwt.mock';
import { createUserStub } from '@modules/user/test/stubs/user.stub';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { access_token } from './mocks/tokens.mock';
import * as argon2 from 'argon2';

jest.mock('../../user/user.service');
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository<User>,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    it('should throw error when user is existed', async () => {
      // Arrange
      jest
        .spyOn(userService, 'createOne')
        .mockRejectedValueOnce(new ConflictException());

      // Act & Assert
      await expect(authService.registerUser(createUserStub())).rejects.toThrow(
        ConflictException,
      );
    });

    it('should successfully register new user', async () => {
      // Arrange
      const userStub = createUserStub();
      const registerDto: AuthCredentialDto = {
        email: 'johndoe@gmail.com',
        password: 'strongpassword',
      };
      jest.spyOn(userService, 'createOne').mockResolvedValueOnce(userStub);

      // Act
      const result = await authService.registerUser(registerDto);

      // Assert
      expect(userService.createOne).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        id: userStub.id,
        email: userStub.email,
      });
    });
  });

  describe('login', () => {
    it('should return email, token and role', async () => {
      // Arrange
      const userStub = createUserStub();
      const payload = { email: userStub.email, userId: userStub.id };
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(access_token);

      // Act
      const result = await authService.login(userStub);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({
        email: userStub.email,
        token: access_token,
        role: userStub.role,
      });
    });
  });

  describe('validateAndGetUser', () => {
    it('should throw unauthorized error when user is not existed', async () => {
      // Arrange
      const userStub = createUserStub();
      const authCredentialDto: AuthCredentialDto = {
        email: userStub.email,
        password: userStub.password,
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        authService.validateAndGetUser(authCredentialDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw unauthorized error when password is not correct', async () => {
      // Arrange
      const userStub = createUserStub();
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userStub);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);

      // Act & Assert
      await expect(
        authService.validateAndGetUser({
          email: userStub.email,
          password: 'wrong password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user when user is existed and password is correct', async () => {
      // Arrange
      const userStub = createUserStub();
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userStub);
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);

      // Act
      const result = await authService.validateAndGetUser({
        email: userStub.email,
        password: userStub.password,
      });

      // Assert
      expect(result).toEqual(userStub);
    });
  });
});
