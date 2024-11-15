import { Test, TestingModule } from '@nestjs/testing';
import { ResidentService } from './resident.service';
import { DatabaseConnectionService } from '@database/database.service';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';
import { Model, Query } from 'mongoose';

describe('ResidentService', () => {
  let service: ResidentService;
  let databaseConnectionService: DatabaseConnectionService;

  const mockResidents = [
    {
      _id: '673026ddcf7eef24b6656b40',
      fullName: 'FernandoUs',
      email: 'fernan@gmail.com',
      apartment: '502',
      createdAt: '2024-11-10T03:22:05.266Z',
      updatedAt: '2024-11-10T03:22:05.266Z',
    },
    {
      _id: '673026f7a2f0af297e837cc8',
      fullName: 'Ricardo',
      email: 'ricardo@gmail.com',
      apartment: '103',
      createdAt: '2024-11-10T03:22:31.722Z',
      updatedAt: '2024-11-10T03:22:31.722Z',
    }
  ];

  // Crear un mock de la query de Mongoose
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockResidents),
  } as unknown as Query<Resident[], Resident>;

  // Crear un mock del modelo con el tipo correcto
  const mockResidentModel = {
    find: jest.fn().mockReturnValue(mockQuery),
  } as unknown as Model<Resident>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidentService,
        {
          provide: DatabaseConnectionService,
          useValue: {
            getConnection: jest.fn().mockResolvedValue({
              model: () => mockResidentModel
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ResidentService>(ResidentService);
    databaseConnectionService = module.get<DatabaseConnectionService>(DatabaseConnectionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllResidents', () => {
    it('should execute the query with proper methods', async () => {
      // Act
      await service.getAllResidents('2');

      // Assert
      expect(mockResidentModel.find).toHaveBeenCalled();
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return residents data', async () => {
      // Act
      const result = await service.getAllResidents('2');

      // Assert
      expect(result).toEqual(mockResidents);
    });

    it('should get the correct connection for the tenant', async () => {
      // Act
      await service.getAllResidents('2');

      // Assert
      expect(databaseConnectionService.getConnection).toHaveBeenCalledWith('2');
    });

    it('should handle database connection error', async () => {
      // Arrange
      jest.spyOn(databaseConnectionService, 'getConnection')
        .mockRejectedValueOnce(new Error('Connection error'));

      // Act & Assert
      await expect(service.getAllResidents('2'))
        .rejects
        .toThrow('Connection error');
    });
  });
});