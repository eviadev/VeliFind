import { Request, Response } from 'express';
import IndexController from '@controllers/index.controller';

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.sendStatus = jest.fn();
  return res as Response;
};

describe('IndexController', () => {
  it('sends a 200 status', () => {
    const controller = new IndexController();
    const res = createMockResponse();
    const next = jest.fn();

    controller.index({} as Request, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });
});
