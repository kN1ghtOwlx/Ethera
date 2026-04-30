import { useState, useEffect } from 'react';
import api from '../api';

export default function Projects({ user }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', members: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberIds = formData.members.split(',').map(id => id.trim()).filter(Boolean);
      await api.post('/projects', { ...formData, members: memberIds });
      setFormData({ name: '', description: '', members: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting project');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Names (comma-separated)
              </label>
              <input
                type="text"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <div key={project._id} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Created by:</span> {project.createdBy?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Members:</span> {project.members?.map(m => m.name).join(', ') || 'None'}
              </p>
            </div>

            {user.role === 'admin' && (
              <button
                onClick={() => handleDelete(project._id)}
                className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No projects yet
        </div>
      )}
    </div>
  );
}