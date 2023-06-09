import "./App.css";
import TextEditor from "./components/TextEditor";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/documents/:id">
					<TextEditor />
				</Route>
				<Route path="/" exact>
					<Redirect to={`/documents/${uuidV4()}`} />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
