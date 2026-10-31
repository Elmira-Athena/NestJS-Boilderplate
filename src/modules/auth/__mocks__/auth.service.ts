import { createUserStub } from '../stubs/user.stub';

export const AuthService = jest.fn().mockReturnValue({
  registerUser: jest.fn().mockReturnValue({
    id: 1,
    email: 'mockemail@gmail.com',
  }),
  login: jest.fn().mockReturnValue({
    email: 'mockemail@gmail.com',
    token: 'mocktoken',
    role: {
      id: 2,
      name: 'member',
    },
  }),
  validateAndGetUser: jest.fn().mockReturnValue(createUserStub()),
});
