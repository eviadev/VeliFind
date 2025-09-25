import { NextFunction, Request, Response } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { AuthUserData } from '@interfaces/auth.interface';

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res as Response;
};

const createMockNext = () => jest.fn() as NextFunction;

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthController();
  });

  describe('signUp', () => {
    it('returns the created user with token data', async () => {
      const payload: CreateUserDto = { email: 'signup@email.com', password: 'secret' };
      const authData: AuthUserData = {
        cookie: 'cookie=value',
        authToken: { token: 'token', expiresIn: 123 },
        user: { _id: 'uid', email: payload.email },
      };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.authService, 'signup').mockResolvedValue(authData);

      await controller.signUp({ body: payload } as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith(payload);
      expect(res.setHeader).toHaveBeenCalledWith('Auth-Cookie', [authData.cookie]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: authData.user, authToken: authData.authToken, message: 'signup' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('logIn', () => {
    it('returns the logged in user with token data', async () => {
      const payload: CreateUserDto = { email: 'login@email.com', password: 'secret' };
      const authData: AuthUserData = {
        cookie: 'cookie=value',
        authToken: { token: 'token', expiresIn: 123 },
        user: { _id: 'uid', email: payload.email },
      };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.authService, 'login').mockResolvedValue(authData);

      await controller.logIn({ body: payload } as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith(payload);
      expect(res.setHeader).toHaveBeenCalledWith('Auth-Cookie', [authData.cookie]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: authData.user, authToken: authData.authToken, message: 'login' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('logOut', () => {
    it('clears the auth cookie', async () => {
      const res = createMockResponse();
      const next = createMockNext();

      await controller.logOut({} as any, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('Auth-Cookie', ['Authorization=; Max-age=0']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'logout' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
