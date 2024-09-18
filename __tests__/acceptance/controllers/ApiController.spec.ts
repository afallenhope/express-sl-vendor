import app from '../../../src/app';
import EnvHelper from '../../../src/helpers/EnvHelper';
import request from 'supertest';


const PORT = +EnvHelper.getEnv('SERVER_PORT', '3000');


let server: any;

beforeEach(async () => {
  server = app.listen(PORT);
});

afterEach(async () => {
  server.close();
});


describe('ApiController', () => {

  describe('GET /api/v1/', () => {

    it('should return OK', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/api/v1/');

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ "message": "OK", "status": "OK", "statusCode": 200 });
    });

  });

});

