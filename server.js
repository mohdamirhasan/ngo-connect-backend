const express = require('express');
const dotenv = require('dotenv').config();
// const cors = require('cors')
// const connectDb = require("./src/config/dbConnect");
// const errorHandler = require("./src/middlewares/errorHandler");
// const path = require("path");

// connectDb();
const app = express();

const port = process.env.PORT || 5000;

// app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// app.use('/api/users', require("./src/routes/userRoutes"));
// app.use('/api/ngo', require("./src/routes/ngoRoutes"));
// app.use('/api/report', require("./src/routes/reportRoutes"));
// app.use('/api/post', require("./src/routes/postRoutes"));


// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
