import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useCallback } from "react";

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
	const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
		if (!wrapper) return;

		wrapper.innerHTML = "";
		const editor = document.createElement("div");
		wrapper.append(editor);
		new Quill(editor, {
			theme: "snow",
			modules: { toolbar: TOOLBAR_OPTIONS },
		});
	}, []);

	return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
