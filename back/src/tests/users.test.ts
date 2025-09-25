import { NextFunction, Request, Response } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const createMockNext = () => jest.fn() as NextFunction;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(() => {
    controller = new UsersController();
  });

  describe('getUsers', () => {
    it('responds with all users', async () => {
      const users: User[] = [{ _id: '1', email: 'a@email.com', password: 'hashed' }];
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.userService, 'findAllUser').mockResolvedValue(users);

      await controller.getUsers({} as Request, res, next);

      expect(serviceSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: users, message: 'findAll' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('responds with the requested user', async () => {
      const user: User = { _id: '42', email: 'user@email.com', password: 'hashed' };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.userService, 'findUserById').mockResolvedValue(user);

      await controller.getUserById({ params: { id: user._id } } as unknown as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith(user._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: user, message: 'findOne' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('creates and returns a user', async () => {
      const payload: CreateUserDto = { email: 'new@email.com', password: 'secret' };
      const created: User = { _id: 'abc', email: payload.email, password: 'hashed' };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.userService, 'createUser').mockResolvedValue(created);

      await controller.createUser({ body: payload } as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith(payload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: created, message: 'created' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('updates and returns the user', async () => {
      const payload: CreateUserDto = { email: 'updated@email.com', password: 'secret' };
      const updated: User = { _id: 'abc', email: payload.email, password: 'hashed' };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.userService, 'updateUser').mockResolvedValue(updated);

      await controller.updateUser({ params: { id: 'abc' }, body: payload } as unknown as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith('abc', payload);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: updated, message: 'updated' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('removes and returns the user', async () => {
      const deleted: User = { _id: 'abc', email: 'delete@email.com', password: 'hashed' };
      const res = createMockResponse();
      const next = createMockNext();

      const serviceSpy = jest.spyOn(controller.userService, 'deleteUser').mockResolvedValue(deleted);

      await controller.deleteUser({ params: { id: 'abc' } } as unknown as Request, res, next);

      expect(serviceSpy).toHaveBeenCalledWith('abc');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: deleted, message: 'deleted' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
