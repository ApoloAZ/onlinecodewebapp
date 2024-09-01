import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Lobby } from "./pages/Lobby.js"
import { CodeBlock } from "./pages/CodeBlock.js"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />}></Route>
          <Route path="/codeblock" element={<CodeBlock />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
