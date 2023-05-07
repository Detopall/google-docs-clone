require("dotenv").config({ path: './config/config.env' });
const connectDB = require("./config/db");
const Document = require("./models/Document");

connectDB();

const io = require("socket.io")(5000, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	},
});

io.on("connection", socket => {
	socket.on("get-document", async (documentId) => {
		const document = await findOrCreateDoc(documentId);
		socket.join(documentId);
		socket.emit("load-document", document.data);
		socket.on("send-changes", (delta) => {
			socket.broadcast.to(documentId).emit("receive-changes", delta);
		});

		socket.on("save-document", async (data) => {
			await Document.findByIdAndUpdate(documentId, { data })
		});
	});

});



async function findOrCreateDoc(id) {
	if (!id) return;

	const document = await Document.findById(id);
	if (document) return document;
	return await Document.create({ _id: id, data: "" });
}
