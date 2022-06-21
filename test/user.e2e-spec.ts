import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { typeOrmTestConf } from './typeorm.config';
import { RoleModule } from '../src/modules/role/role.module';

describe('User module', () => {
  const user = {
    id: 1,
    firstName: 'first name',
    lastName: 'lastname',
    email: 'email@test.com',
  };

  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmTestConf), UserModule, RoleModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    server = await app.getHttpServer();
  });

  it('Should create user', async () => {
    return request(server)
      .post('/api/users')
      .send(user)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.email).toEqual(user.email);
      });
  });

  it('Should update user', async () => {
    const newFirstName = 'New first name';
    return request(app.getHttpServer())
      .patch('/api/users/1')
      .send({
        firstName: newFirstName,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.data.firstName).toEqual(newFirstName);
      });
  });

  it('Should fetch users', async () => {
    return request(server)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => expect(body.data).toBeDefined());
  });

  it('Should paginate, filter, select columns', async () => {
    return request(server)
      .get('/api/users?page=1&columns=id&firstName=first')
      .expect(200)
      .then(({ body }) => {
        expect(body.total).toBeDefined();
        expect(body.data[0].id).toBeDefined();
        expect(body.data[0].lastName).toBeUndefined();
      });
  });

  it('Should delete user', () => {
    return request(server).delete('/api/users/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
