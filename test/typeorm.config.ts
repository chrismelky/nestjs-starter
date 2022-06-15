import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmTestConf: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'test.sqlite',
  driver: require('sqlite3'),
  autoLoadEntities: true,
  synchronize: true,
};
