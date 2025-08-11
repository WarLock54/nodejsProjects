import express from 'express';
import {
  createAndTrainModel,
  getModelInfo,
  deleteModelByName,
  predictCost
} from './Controllers/VacationController.js';

const router = express.Router();

router.post('/model', createAndTrainModel);
router.get('/model/:name', getModelInfo);
router.delete('/model/:name', deleteModelByName);
router.post('/model/:name/predict', predictCost);

export default router;
