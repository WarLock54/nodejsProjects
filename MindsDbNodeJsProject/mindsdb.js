require('dotenv').config();
const MindsDB = require('mindsdb-js-sdk');

const MINDSDB_HOST = process.env.MINDSDB_HOST;
const MINDSDB_PORT = process.env.MINDSDB_PORT;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME;

module.exports = {
    connectToMindsDB : async function() {
    try {
        await MindsDB.default.connect({
            host: `http://${MINDSDB_HOST}:${MINDSDB_PORT}`,
        });
        console.log('Connected to local MindsDB instance successfully!');
    } catch (error) {
        console.error('Error connecting to local MindsDB instance:', error);
    }
},
verifyDataConnection: async function() {
        console.log('Verifying data connection to PostgreSQL...');
        try {
            const query = `SELECT * FROM postgres.public.vacations LIMIT 5;`;
            const result = await MindsDB.default.SQL.runQuery(query);
            console.log(`Successfully fetched ${result.rows.length} rows from 'vacations' table. ✅`);
            if (result.rows.length > 0) {
                console.log('Sample data:', result.rows);
            } else {
                console.warn('Warning: The "vacations" table is empty or has no data.');
            }
            return true;
        } catch (error) {
            console.error('🔴 Failed to read data from PostgreSQL via MindsDB.');
            console.error('--> MindsDB Error:', error.response?.data?.error_message || error.message);
            return false;
        }
    },
      connectPostgresqlToMindsDB : async function() {
    const connectionParams = {
        user: "postgres",
        port: 5432,
        password: "admin",
        host: "localhost",
        database: "postgres"
    };

    try {
        const databases = await MindsDB.default.Databases.getAllDatabases();
        if (databases.some(db => db.name === POSTGRES_DB_NAME)) {
            console.log('PostgreSQL database is already connected to MindsDB!');
            return;
        }

        await MindsDB.default.Databases.createDatabase(
            POSTGRES_DB_NAME,
            'postgres',
            connectionParams
        );
        console.log('PostgreSQL database connected successfully to MindsDB!');
    } catch (error) {
        console.error('Error connecting PostgreSQL to MindsDB:', error);
    }
},
waitForModelTraining: async function(modelName, project = 'mindsdb'){
 let model = await MindsDB.default.Models.getModel(modelName, project);
  while (model.status === 'generating') {
    console.log(`Model status: ${model.status}. Waiting 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    model = await MindsDB.default.Models.getModel(modelName, project);
  }
  console.log(`Model status: ${model.status}`);
  return model;
},
 createAndTrainModel: async function() {
    const regressionTrainingOptions = {
        integration: POSTGRES_DB_NAME, 
        select: 'SELECT * FROM public.vacations',
    };
    try {
        const models = await MindsDB.default.Models.getAllModels('mindsdb');
        if (models.some(model => model.name === 'vacation_cost_model')) {
            console.log('Model vacation_cost_model already exists! Deleting and recreating...');
            await MindsDB.default.Models.deleteModel('vacation_cost_model', 'mindsdb');
        }

        let vacationCostModel = await MindsDB.default.Models.trainModel(
            'vacation_cost_model',
            'cost',
            'mindsdb',
            regressionTrainingOptions
        );
        console.log('Initial trainModel response:', vacationCostModel);

        if (!vacationCostModel) {
            console.error('Model object is undefined or null!');
            return;
        }

        vacationCostModel = await module.exports.waitForModelTraining('vacation_cost_model');
        
        if (vacationCostModel.status === 'complete') {
            console.log('Model training completed successfully! ✅');
        } else if (vacationCostModel.status === 'error') {
            console.error('Model training failed. 🔴 Fetching error details...');
            try {
                const errorQuery = `
                    SELECT error FROM mindsdb.logs
                    WHERE project_name = 'mindsdb' AND api = 'ml' AND model_name = 'vacation_cost_model'
                    ORDER BY created_at DESC LIMIT 1`;
                const errorResult = await MindsDB.default.SQL.runQuery(errorQuery);
                if (errorResult && errorResult.rows.length > 0) {
                    console.error('--> MindsDB Error Details:', errorResult.rows[0].error);
                } else {
                    console.error('--> Could not retrieve specific error details from mindsdb.logs.');
                }
            } catch (logError) {
                console.error('--> Failed to query mindsdb.logs for error details:', logError);
            }
            return; // Hata varsa fonksiyonu sonlandır
        } else {
            console.log(`Model training ended with unexpected status: ${vacationCostModel.status}`);
        }
    } catch (error) {
        console.log('Error during model creation/training:', error.response?.data || error);
    }
},

    makeVacationCostPrediction: async function(destination, duration) {
        try {
            const vacationCostModel = await MindsDB.default.Models.getModel('vacation_cost_model', 'mindsdb');
            if (!vacationCostModel) {
                // This error will now be more accurate if the model fails to be retrieved.
                throw new Error('Prediction failed because the model "vacation_cost_model" could not be found.');
            }
            
            // This check is the most likely source of your prediction error.
            if (vacationCostModel.status !== 'complete') {
                throw new Error(`Model is not ready for prediction. Current status: '${vacationCostModel.status}'`);
            }
            
            const queryOptions = {
                where: `destination = '${destination}' AND duration = ${duration}`
            };
            const prediction = await vacationCostModel.query(queryOptions);
            return {
                value: prediction.value,
                insights: prediction.explain,
                inputData: prediction.data
            };
    
        } catch (error) {
            // This now logs the more descriptive error from the try block.
            console.error('Error during prediction query:', error.message || error);
            return null;
        }
    }
}