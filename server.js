require('dotenv').config();
const express = require('express');
const schoolRoutes = require('./routes/schoolRoute');
const app = express();

app.use(express.json());

app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));