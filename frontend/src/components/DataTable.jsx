import { useState, useEffect } from 'react';
import axios from 'axios';

function DataTable() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null); // Track which row is being edited
  const [editData, setEditData] = useState({}); // Store edited data temporarily
  const [newData, setNewData] = useState({
    name: '',
    revenue: '',
    profit: '',
    employees: '',
    country: '',
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/companies/');
      setData(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditData({ ...item });
  };

  const handleEditChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`/api/update_company/${id}/`, editData);
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error('Edit error:', error);
      alert('Error saving edit');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_company/${id}/`);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting row');
    }
  };

  const handleAddChange = (e, field) => {
    setNewData({ ...newData, [field]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      await axios.post('/api/add_company/', newData);
      setNewData({ name: '', revenue: '', profit: '', employees: '', country: '' });
      fetchData();
    } catch (error) {
      console.error('Add error:', error);
      alert('Error adding row');
    }
  };

  const startGeneration = async () => {
    setGenerating(true);
    await axios.get('/api/generate_data/');
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval); // Cleanup (won’t work as is, see note below)
  };

  const stopGeneration = async () => {
    setGenerating(false);
    await axios.get('/api/stop_generation/');
  };

  return (
    <div className="table-container">
      <button onClick={startGeneration} disabled={generating}>Generate Data</button>
      <button onClick={stopGeneration} disabled={!generating}>Stop</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Employees</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                {editId === item.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) => handleEditChange(e, 'name')}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input
                    value={editData.revenue}
                    onChange={(e) => handleEditChange(e, 'revenue')}
                  />
                ) : (
                  item.revenue
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input
                    value={editData.profit}
                    onChange={(e) => handleEditChange(e, 'profit')}
                  />
                ) : (
                  item.profit
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input
                    value={editData.employees}
                    onChange={(e) => handleEditChange(e, 'employees')}
                  />
                ) : (
                  item.employees
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input
                    value={editData.country}
                    onChange={(e) => handleEditChange(e, 'country')}
                  />
                ) : (
                  item.country
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <button onClick={() => handleEditSave(item.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEditStart(item)}>Edit</button>
                )}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {/* Add New Row */}
          <tr>
            <td>
              <input
                value={newData.name}
                onChange={(e) => handleAddChange(e, 'name')}
                placeholder="Name"
              />
            </td>
            <td>
              <input
                value={newData.revenue}
                onChange={(e) => handleAddChange(e, 'revenue')}
                placeholder="Revenue"
              />
            </td>
            <td>
              <input
                value={newData.profit}
                onChange={(e) => handleAddChange(e, 'profit')}
                placeholder="Profit"
              />
            </td>
            <td>
              <input
                value={newData.employees}
                onChange={(e) => handleAddChange(e, 'employees')}
                placeholder="Employees"
              />
            </td>
            <td>
              <input
                value={newData.country}
                onChange={(e) => handleAddChange(e, 'country')}
                placeholder="Country"
              />
            </td>
            <td>
              <button onClick={handleAddSave}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;