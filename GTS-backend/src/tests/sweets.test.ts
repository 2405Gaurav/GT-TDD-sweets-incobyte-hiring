import request from 'supertest';
import './setup';
import app from '../app';
import { User } from '../models/Users';
import { Sweet } from '../models/Sweets';

describe('Sweets Management', () => {
  let customerToken: string;
  let adminToken: string;
  let sweetId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Register customer
    const customerResponse = await request(app).post('/api/auth/register').send({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
    });
    customerToken = customerResponse.body.token;

    // Register admin
    const adminResponse = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = adminResponse.body.token;
  });

  describe('POST /api/sweets - Create Sweet', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: 2.5,
          quantity: 100,
          description: 'Delicious milk chocolate',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.price).toBe(2.5);
      sweetId = response.body._id;
    });

    it('should reject sweet creation for non-admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Lollipop',
          category: 'lollipop',
          price: 0.5,
          quantity: 50,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('permission');
    });

    it('should reject sweet creation without token', async () => {
      const response = await request(app).post('/api/sweets').send({
        name: 'Candy',
        category: 'candy',
        price: 1.0,
        quantity: 50,
      });

      expect(response.status).toBe(401);
    });

    it('should fail when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete Sweet',
        });

      expect(response.status).toBe(400);
    });

    it('should reject negative price', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Sweet',
          category: 'candy',
          price: -5,
          quantity: 10,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('negative');
    });
  });

  describe('GET /api/sweets - Get All Sweets', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: 2.5,
          quantity: 100,
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Lollipop',
          category: 'lollipop',
          price: 0.5,
          quantity: 50,
        });
    });

    it('should get all sweets without authentication', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return empty array when no sweets exist', async () => {
      await Sweet.deleteMany({});

      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PUT /api/sweets/:id - Update Sweet', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Original Sweet',
          category: 'candy',
          price: 1.0,
          quantity: 50,
        });
      sweetId = response.body._id;
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Sweet',
          price: 2.0,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
      expect(response.body.price).toBe(2.0);
    });

    it('should reject update for non-admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Updated Sweet',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('permission');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id - Delete Sweet', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Sweet to Delete',
          category: 'candy',
          price: 1.0,
          quantity: 50,
        });
      sweetId = response.body._id;
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    it('should reject delete for non-admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('permission');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});