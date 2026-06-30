require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

//socket 
const { initSocket } = require("./Socket/socket");

//  ROUTES
const job_router = require('./routers/job_router/job_router');
const Auth_router = require('./routers/Auth_router/Auth_router');
const Bid_router = require('./routers/Bid_router/Bid_router');
const hired_router = require('./routers/hired_Freelancer/hired_router');
const user_router = require('./routers/User_router/User_router');
const Freelancer_router = require('./routers/Freelancer_releted_router/Freelancers_router');
const notification_router = require('./routers/Notification/notification_roter'); 
const Extra_info_router = require('./routers/Extra_user_info/Extra_info');
const contract_router = require('./routers/contract_router/contract_router');

//  DB
const ConnectDB = require('./connections/DB');

//  PORT
const PORT = process.env.PORT || 3000;

//  CONNECT DB
ConnectDB();

const server = http.createServer(app);

//  INIT SOCKET
initSocket(server);

//  MIDDLEWARE
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

//  ROUTES
app.use(job_router);
app.use(Auth_router);
app.use(Bid_router);
app.use(hired_router);
app.use(user_router);
app.use(Freelancer_router);
app.use(notification_router); 
app.use(Extra_info_router);
app.use(contract_router); //line 53

//  TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend running successfully 🚀");
});


server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
