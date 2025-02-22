const express = require('express');
const dotenv = require('dotenv').config();
// const cors = require('cors')
const connectDb = require("./config/dbConnect");
// const errorHandler = require("./src/middlewares/errorHandler");
// const path = require("path");

connectDb();
const app = express();

const port = process.env.PORT || 5001;

// app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

app.use('/api/users', require("./routes/userRoutes"));
// app.use('/api/ngo', require("./routes/ngoRoutes"));
// app.use('/api/report', require("./routes/reportRoutes"));
// app.use('/api/post', require("./routes/postRoutes"));


// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
