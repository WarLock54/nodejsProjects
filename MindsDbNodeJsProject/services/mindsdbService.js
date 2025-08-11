import MindsDB from 'mindsdb-js-sdk';

await MindsDB.connect({
  user: 'mindsdb',
  password: 'mindsdb123',
  host: 'http://127.0.0.1:47334'
});

export async function getAllModels() {
  return await MindsDB.Models.getAllModels('mindsdb');
}

export async function getModel(modelName) {
  return await MindsDB.Models.getModel(modelName, 'mindsdb');
}

export async function createModel(modelName, targetColumn, options) {
  return await MindsDB.Models.trainModel(
    modelName,
    targetColumn,
    'mindsdb',
    options
  );
}

export async function deleteModel(modelName) {
  return await MindsDB.Models.deleteModel(modelName, 'mindsdb');
}

export async function predict(modelName, input) {
  return await MindsDB.Models.predict(modelName, 'mindsdb', input);
}
