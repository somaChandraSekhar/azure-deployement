import { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import Charts from './components/Charts';
import './index.css';

function App() {
  const [view, setView] = useState('table');

  return (
    <div className="app">
      <h1>Excel ETL PROJECT deploying in Azure</h1>
      <div className="container">
        <div className="sidebar">
          <FileUpload />
          <button onClick={() => setView('table')}>Table View</button>
          <button onClick={() => setView('bar')}>Bar Chart</button>
          <button onClick={() => setView('pie')}>Pie Chart</button>
          <button onClick={() => setView('box')}>Box Plot</button>
        </div>
        <div className="content">
          {view === 'table' && <DataTable />}
          {view !== 'table' && <Charts view={view} />}
        </div>
      </div>
    </div>
  );
}

export default App;