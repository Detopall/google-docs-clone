import "quill/dist/quill.snow.css";
import Quill, { Delta } from "quill";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

function TextEditor() {
	const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const [quill, setQuill] = useState<Quill>();

	useEffect(() => {
		const s = io("http://localhost:5000");
		setSocket(s);

		return () => {
			s.disconnect();
		};
	}, []);

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

		setQuill(q);
	}, []);

	return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
