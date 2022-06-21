import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
