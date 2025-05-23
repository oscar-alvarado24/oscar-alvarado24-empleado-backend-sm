// src/infrastructure/web/express/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();

// The actual controller instance will be injected when these routes are setup in app.js
module.exports = (employeeController) => {
  router.post('/', (req, res, next) => employeeController.create(req, res, next));
  router.get('/:id', (req, res, next) => employeeController.getById(req, res, next));
  router.get('/', (req, res, next) => employeeController.getAll(req, res, next));
  router.put('/:id', (req, res, next) => employeeController.update(req, res, next));
  router.delete('/:id', (req, res, next) => employeeController.delete(req, res, next));
  return router;
};
