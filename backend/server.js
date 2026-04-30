import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import projectRoutes from './src/routes/projects.js';
import taskRoutes from './src/routes/tasks.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL.split(","),
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})