import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lobby from './pages/Lobby.js';
import CodeBlock from './pages/CodeBlock.js';
import NoPage from './pages/NoPage.js';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Lobby />} />
          <Route path='/codeblock/:id' element={<CodeBlock />} />
          <Route path='/*' element={<NoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
