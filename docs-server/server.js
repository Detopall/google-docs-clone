const io = require("socket.io")(5000, {
	  cors: {
		origin: "*",
		methods: ["GET", "POST"]
	  },
});

io.on("connection", socket => {
	socket.on("get-document", (documentId) => {
		const data = "";
		socket.join(documentId);
		socket.emit("load-document", data);
		socket.on("send-changes", (delta) => {
			socket.broadcast.to(documentId).emit("receive-changes", delta);
		});
	});

	socket.on("save-document", (data) => {
		socket.broadcast.emit("save-document", data);
	});
});

