require('dotenv').config();

const express = require('express');
const {
    connectToMindsDB,
    connectPostgresqlToMindsDB,
    createAndTrainModel,
    makeVacationCostPrediction
} = require('./mindsdb.js');

const app = express();
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

app.use(express.json());

app.post('/predict/vacation-cost', async (req, res) => {
    const { destination, duration } = req.body;

    try {
        const prediction = await makeVacationCostPrediction(destination, duration);
        if (prediction) {
            res.status(200).json(prediction);
        } else {
            res.status(500).json({ message: 'Error making prediction' });
        }
    } catch (error) {
        console.error('Error in /predict/vacation-cost route:', error);
        res.status(500).json({ message: 'Error making prediction' });
    }
});

app.listen(APP_PORT, async () => {
    console.log(`Server is running at http://${APP_HOST}:${APP_PORT}`);
    await connectToMindsDB();
    await connectPostgresqlToMindsDB();
    await createAndTrainModel();
});