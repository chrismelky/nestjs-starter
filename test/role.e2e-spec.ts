import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../src/modules/role/role.module';
import * as request from 'supertest';
import { typeOrmTestConf } from './typeorm.config';

describe('Role E2E test', () => {
  const role = {
    id: 1,
    name: 'Role #1',
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmTestConf), RoleModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /roles]', async () => {
    return request(app.getHttpServer())
      .post('/api/roles')
      .send(role)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.name).toEqual(role.name);
      });
  });

  it('Update [PUT] /roles', () => {
    const newName = 'New role name';
    return request(app.getHttpServer())
      .put('/api/roles/1')
      .send({
        ...role,
        name: newName,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.data.name).toEqual(newName);
      });
  });

  it('Delete DELETE /roles', () => {
    request(app.getHttpServer()).delete('/api/roles/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
