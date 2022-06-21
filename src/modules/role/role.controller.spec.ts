import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleService } from './role.service';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create role', async () => {
    return controller.create({}).then(({ data }) => {
      expect(data).toBeDefined();
    });
  });

  it('should find all', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);
    return controller.fetch({}).then(({ data }) => {
      expect(data).toBeDefined();
    });
  });

  it('should paginate', async () => {
    jest.spyOn(service, 'paginate').mockResolvedValue([[], 1]);
    return controller.fetch({ page: 1 }).then(({ data, total }) => {
      expect(data).toBeDefined();
      expect(total).toBeDefined();
    });
  });
});
