const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("Server is Up and Running!")
})


//socket.io logic
io.on("connection", (socket) => {
    //emit after connection
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    })

    socket.on("calluser", (userToCall, signalData, from, name) => {
        io.to(userToCall).emit("calluser", {signal: signalData, from, name});
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    })
});

server.listen(PORT, () => console.log(`Server Listening on port: ${PORT}`))


 