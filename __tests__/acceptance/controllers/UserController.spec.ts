import app from '../../../src/app';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import UserService from '../../../src/services/UserService';
import CreateUserDto from '../../../src/dtos/CreateUserDto';
import { User } from '../../../src/database/entities/UserEntity';

jest.mock('../../../src/services/UserService');

describe('UserController', () => {

  let mockUserService: jest.Mocked<typeof UserService>,
    avKey: string,
    username: string,
    firstName: string,
    lastName: string,
    mockPostData: CreateUserDto;

  beforeEach(() => {
    mockUserService = UserService as jest.Mocked<typeof UserService>;
    avKey = uuidv4();
    username = 'test.user';
    firstName = 'test';
    lastName = 'user';

    mockPostData = {
      avKey,
      firstName,
      lastName,
      username,
    };
  });

  describe('GET /api/v1/users', () => {

    it('should return a 401 statusCode', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/api/v1/users');

      // Assert
      expect(response.statusCode).toBe(401);
    });


  });


  describe('POST /api/v1/users', () => {

    it('should create a user, if not exists', async () => {
      // Arrange
      const mockUser = new User();
      mockUser.username = username;
      mockUser.firstName = firstName;
      mockUser.lastName = lastName;
      mockUser.avKey = avKey;
      mockUser.id = uuidv4()
      mockUserService.createUser.mockResolvedValue(mockUser);

      // Act
      const response = await request(app).post('/api/v1/users').send(mockPostData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it('should not create a user, if request is invalid', async () => {
      // Arrange
      const mockUser = {
        firstName: 'test',
        lastName: 'user1',
      };
      mockUserService.createUser.mockResolvedValue(400);


      // Act
      const response = await request(app).post('/api/v1/users').send(mockUser);

      // Assert
      expect(response.statusCode).toBe(400);
    });

  });


});

