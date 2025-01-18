import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { FaEdit, FaTrash, FaSave } from "react-icons/fa"; // Import icons
import "../App.css";

const API_URL = "http://localhost:5000"; // Base URL of your backend

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data); // Set tasks from backend
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert('Error fetching tasks: ' + error.message); // Alert for better feedback
    }
  };

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/add-task`, {
          content: newTask,
          checked: false, // Default value for new tasks
        });
        setTasks([...tasks, response.data]); // Add new task to state
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
        alert('Error adding task: ' + error.message); // Alert for better feedback
      }
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert('Error deleting task: ' + error.message); // Alert for better feedback
    }
  };

  // Start editing a task
  const handleEditTask = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Save the edited task
  const handleSaveTask = async () => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${editingId}`, {
        content: editingText,
      });
      setTasks(
        tasks.map((task) =>
          task._id === editingId ? { ...task, content: response.data.content } : task
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error saving task:", error);
      alert('Error saving task: ' + error.message); // Alert for better feedback
    }
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {editingId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="task-input-edit"
                />
                <button onClick={handleSaveTask} className="save-button">
                  <FaSave />
                </button>
              </>
            ) : (
              <>
                <span className={task.checked ? 'checkList' : 'notCheckList'}>
                  {task.content}
                </span>
                <button
                  onClick={() => handleEditTask(task._id, task.content)}
                  className="edit-btn"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="delete-btn"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
