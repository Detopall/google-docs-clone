import "quill/dist/quill.snow.css";
import Quill, { Delta, DeltaStatic } from "quill";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
	["bold", "italic", "underline", "strike"],
	["image", "blockquote", "code-block"],

	[{ list: "ordered" }, { list: "bullet" }],
	[{ script: "sub" }, { script: "super" }],
	[{ indent: "-1" }, { indent: "+1" }],
	[{ direction: "rtl" }],

	[{ header: [1, 2, 3, 4, 5, 6, false] }],

	[{ color: [] }, { background: [] }],
	[{ font: [] }],
	[{ align: [] }],

	["clean"],
];

const SAVE_INTERVAL_MS = 5000;

function TextEditor() {
	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const [quill, setQuill] = useState<Quill>();
	const { id: documentId } = useParams<{ id: string }>();

	useEffect(() => {
		const s = io("http://localhost:5000");
		setSocket(s);

		return () => {
			s.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket || !quill) return;


		const interval = setInterval(() => {
			socket.emit("save-document", quill.getContents());
		}, SAVE_INTERVAL_MS);

		return () => {
			clearInterval(interval);
		}

	}, [socket, quill]);

	useEffect(() => {
		if (!socket || !quill) return;

		socket.once("load-document", (document: DeltaStatic) => {
			quill.setContents(document);
			quill.enable();
		});

		socket.emit("get-document", documentId);

	}, [socket, quill, documentId]);

	useEffect(() => {
		if (!quill || !socket) return;

		const handler = (delta: Delta, oldDelta: Delta, source: string) => {
			if (source !== "user") return;
			socket.emit("send-changes", delta);
		};
		quill.on("text-change", handler);

		return () => {
			quill.off("text-change", handler);
		};
	}, [socket, quill]);

	useEffect(() => {
		if (!quill || !socket) return;

		const handler = (delta: Delta) => {
			quill.updateContents(delta);
		};
		socket.on("receive-changes", handler);

		return () => {
			socket.off("receive-changes", handler);
		};
	}, [socket, quill]);

	const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
		if (!wrapper) return;

		wrapper.innerHTML = "";
		const editor = document.createElement("div");
		wrapper.append(editor);
		const q = new Quill(editor, {
			theme: "snow",
			modules: { toolbar: TOOLBAR_OPTIONS },
		});

		q.disable();
		q.setText("Loading...");

		setQuill(q);
	}, []);

	return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
