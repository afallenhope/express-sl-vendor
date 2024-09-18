import app from '../../../src/app';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import MagicLinkService from '../../../src/services/MagicLinkService';
import { Link } from '../../../src/database/entities/LinkEntity';
import AuthHelper from '../../../src/helpers/AuthHelper';

jest.mock('../../../src/services/MagicLinkService');

describe('MagicLinkController', () => {

  let mockMagicLinkService: jest.Mocked<typeof MagicLinkService>,
    avKey: string,
    token: string,
    mockPostData: { avKey: string, callbackUrl: string };

  beforeEach(() => {
    mockMagicLinkService = MagicLinkService as jest.Mocked<typeof MagicLinkService>;
    avKey = uuidv4();
    token = AuthHelper.randomString(50);
    mockPostData = {
      avKey,
      callbackUrl: 'https://mock.url',
    };
  });

  describe('GET /api/v1/checkin', () => {

    it('should return a 400 status code, due to invalid headers', async () => {
      // Arrange
      // Act
      const response = await request(app).post('/api/v1/checkin').send(mockPostData);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Bad Request');
    });

    it('should return a 409 status code, if link already exists', async () => {
      // Arrange
      mockMagicLinkService.generateLink.mockResolvedValue(409);
      const headers = {
        'x-secondlife-requested-by': uuidv4(),
        'User-Agent': 'Second-Life-LSL',
      };
      // Act
      //
      const response = await request(app).post('/api/v1/checkin').set(headers).send(mockPostData);

      // Assert
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('Link Exists already.');
    });

    it('should return 200 with magic link if generation is successful', async () => {
      //Arrange
      const rndString = AuthHelper.randomString(50);
      const mockLink = new Link();
      mockLink.magicLink = rndString;
      mockMagicLinkService.generateLink.mockResolvedValue(mockLink);
      const headers = {
        'x-secondlife-requested-by': uuidv4(),
        'User-Agent': 'Second-Life-LSL',
      };

      // Act
      const response = await request(app).post('/api/v1/checkin').set(headers).send(mockPostData);

      //Assert
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(rndString);
    });

  });

  describe('GET /api/v1/login/:avkey/:token', () => {

    it('should return 200 if login is successful', async () => {
      // Arrange
      const rndString = AuthHelper.randomString(50);
      const mockLink = new Link();
      mockLink.magicLink = rndString;
      mockMagicLinkService.validate.mockResolvedValue(mockLink);
      const userId = uuidv4();
      const token = AuthHelper.randomString(50);

      // Act
      const response = await request(app).get(`/api/v1/login/${userId}/${token}`);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('challenged code');
    });

    it('should return 404 if link is not found', async () => {
      // Arrange
      mockMagicLinkService.validate.mockResolvedValue(404);
      const userId = uuidv4();
      const token = AuthHelper.randomString(50);

      // Act
      const response = await request(app).get(`/api/v1/login/${userId}/${token}`);

      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Link Not Found');
    });

    it('should return 440 if link has expired', async () => {
      // Arrange
      mockMagicLinkService.validate.mockResolvedValue(440);
      const userId = uuidv4();
      const token = AuthHelper.randomString(50);

      // Act
      const response = await request(app).get(`/api/v1/login/${userId}/${token}`);

      // Assert
      expect(response.statusCode).toBe(440);
      expect(response.body.message).toBe('Link Expired.');
    });

  });

});

