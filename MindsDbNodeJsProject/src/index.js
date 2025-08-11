import express from 'express';
import vacationModelRoutes from './Routes/VacationModelRoutes.js';

const app = express();
app.use(express.json());

app.use('/api', vacationModelRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
