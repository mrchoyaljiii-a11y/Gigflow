require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const job_router = require('./routers/job_router/job_router');
const Auth_router = require('./routers/Auth_router/Auth_router');
const Bid_router = require('./routers/Bid_router/Bid_router');
const ConnectDB = require('./connections/DB');

const PORT = process.env.PORT || 3000;

ConnectDB();

// app.use(cors({
//     origin: ['http://localhost:5173',
//         'https://gigflow-ktgy.vercel.app'
//     ],
//     credentials: true,
// }))

app.use(cors({
  origin: "https://gigflow-ktgy.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});


// job router
app.use(job_router);

// auth router
app.use(Auth_router);

// Bid router
app.use(Bid_router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

