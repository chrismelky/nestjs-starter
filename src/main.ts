import { ValidationPipe } from '@nestjs/common';
import { NestContainer, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger.middleware';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.use(logger)
  await app.listen(3000);

  // const server = app.getHttpServer();
  // const router = server._events.request._router;
  // const router2 = server._events;

  // console.log(server.context);

  // const availableRoutes: [] = router.stack
  //   .map((layer) => {
  //     if (layer.route) {
  //       //   console.log(typeof layer.route.stack[0].handle);

  //       return {
  //         route: {
  //           path: layer.route?.path,
  //           method: layer.route?.stack[0].method,
  //         },
  //       };
  //     }
  //   })
  //   .filter((item) => item !== undefined);
  // console.log(availableRoutes);
}
bootstrap();
