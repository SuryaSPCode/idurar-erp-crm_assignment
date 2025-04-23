const request = require('supertest');
const express = require('express');
const queryRoutes = require('./queryRoutes');

// Mock middleware and controller
jest.mock('@/controllers/coreControllers/adminAuth', () => ({
  isValidAuthToken: (req, res, next) => next(),
}));

jest.mock('@/controllers/appControllers/queryController/queries', () => ({
  getQueries: jest.fn((req, res) => res.json([{ id: 1 }])),
  createQuery: jest.fn((req, res) => res.status(201).json({ id: 2 })),
  getQueryById: jest.fn((req, res) => res.json({ id: req.params.id })),
  updateQuery: jest.fn((req, res) => res.json({ success: true })),
  deleteQuery: jest.fn((req, res) => res.status(204).end()),
  addNote: jest.fn((req, res) => res.status(201).json({ noteId: 'abc' })),
  deleteNote: jest.fn((req, res) => res.status(204).end()),
}));

const app = express();
app.use(express.json());
app.use('/api', queryRoutes);

describe('Query Routes', () => {
  it('GET /queries - should return list of queries', async () => {
    const res = await request(app).get('/api/queries');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  it('POST /queries - should create a query', async () => {
    const res = await request(app).post('/api/queries').send({ customerName: 'Test' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /queries/:id - should return a query', async () => {
    const res = await request(app).get('/api/queries/123');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('123');
  });

  it('PATCH /queries/:id - should update a query', async () => {
    const res = await request(app).patch('/api/queries/123').send({ status: 'resolved' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /queries/:id - should delete a query', async () => {
    const res = await request(app).delete('/api/queries/123');
    expect(res.statusCode).toBe(204);
  });

  it('POST /queries/:id/notes - should add a note', async () => {
    const res = await request(app).post('/api/queries/123/notes').send({ content: 'Test note' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('noteId');
  });

  it('DELETE /queries/:id/notes/:noteId - should delete a note', async () => {
    const res = await request(app).delete('/api/queries/123/notes/n1');
    expect(res.statusCode).toBe(204);
  });
});
