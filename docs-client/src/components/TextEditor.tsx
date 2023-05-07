import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useCallback } from "react";

function TextEditor() {
	const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
		if (!wrapper) return;

		wrapper.innerHTML = "";
		const editor = document.createElement("div");
		wrapper.append(editor);
		new Quill(editor, { theme: "snow" });
	}, []);

	return <div id="container" ref={wrapperRef}></div>;
}

export default TextEditor;
