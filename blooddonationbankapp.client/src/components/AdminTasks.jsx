/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminTask.css';

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', status: 0 });
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const statusMap = {
        0: 'Pending',
        1: 'In Progress',
        2: 'Completed',
        3: 'Canceled',
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://localhost:7003/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
            } catch (err) {
                setError('Error fetching tasks');
            }
        };

        fetchTasks();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setNewTask((prev) => ({
            ...prev,
            status: parseInt(status, 10), // Ensure correct type
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!newTask.title || !newTask.description || !newTask.dueDate) {
            setError('All fields are required');
            return;
        }

        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(newTask.dueDate);
        if (!isValidDate) {
            setError('Invalid date format (YYYY-MM-DD required)');
            return;
        }

        try {
            const response = await axios.post('https://localhost:7003/api/tasks', newTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setTasks((prev) => [...prev, response.data]);
            setNewTask({ title: '', description: '', dueDate: '', status: 0 });
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to create task. Please try again.';
            setError(message);
        }
    };

  

   

    return (
        <div className="admin-tasks">
            <h2>Admin Task Management</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                />
                <select name="status" value={newTask.status} onChange={handleStatusChange}>
                    {Object.entries(statusMap).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
                <button type="submit">Create Task</button>
            </form>

       
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Status</th>
                  
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.dueDate}</td>
                            <td> <span className={`status-${statusMap[task.status].toLowerCase().replace(' ', '-')}`}>
                                {statusMap[task.status]}
                            </span></td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTasks;
