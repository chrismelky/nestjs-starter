import { HttpAdapterHost } from '@nestjs/core';
import { ErrorHandlerFilter } from './error-handler.filter';

describe('ErrorHandlerFilter', () => {
  it('should be defined', () => {
    expect(new ErrorHandlerFilter(new HttpAdapterHost())).toBeDefined();
  });
});
