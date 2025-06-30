import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import REST routes
import projectRoutes from './routes/projects';
import monitorRoutes from './routes/monitors';
import badgeRoutes from './routes/badge';
import monitorStatusRoutes from './routes/monitorStatuses';

const PORT = process.env.PORT || 3000;

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// REST endpoints
app.use('/projects', projectRoutes);
app.use('/monitors', monitorRoutes);
app.use('/badge', badgeRoutes);
app.use('/monitors', monitorStatusRoutes);

app.get('/', (_req, res) => {
  res.send('Monitoring API is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
