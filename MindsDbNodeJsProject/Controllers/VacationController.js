import {
  getAllModels,
  getModel,
  createModel,
  deleteModel,
  predict
} from '../services/mindsdbService.js';
module.exports = {
  createAndTrainModel: async function (req, res) {
  const modelName = 'vacation_cost_model';
  const targetColumn = 'cost';
  const regressionTrainingOptions = {
    select: 'SELECT destination, duration, cost FROM my_db.vacations',
    integration: 'mindsdb'
  };

  try {
    const models = await getAllModels();
    if (models.some(model => model.name === modelName)) {
      return res.status(200).json({ message: 'Model already exists' });
    }

    let vacationCostModel = await createModel(modelName, targetColumn, regressionTrainingOptions);

    while (vacationCostModel.status !== 'complete' && vacationCostModel.status !== 'error') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      vacationCostModel = await getModel(modelName);
    }

    res.json({ status: vacationCostModel.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

 getModelInfo : async function (req, res)  {
  try {
    const model = await getModel(req.params.name);
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
 deleteModelByName : async function (req, res)  {
  try {
    await deleteModel(req.params.name);
    res.json({ message: 'Model deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
predictCost: async function (req, res)  {
  try {
    const result = await predict(req.params.name, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}