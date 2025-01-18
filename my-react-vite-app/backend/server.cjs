const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;

// CORS setup to allow requests from React frontend (localhost:3000) and Vite (localhost:5174)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5174'], // Allow both frontend URLs
}));

app.use(express.json()); // To parse JSON request bodies

// MongoDB Atlas connection
mongoose
  .connect("mongodb+srv://bariaayyan:nNPRNp5qmpKY9MzJ@cluster0.accqi.mongodb.net/todo-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  content: String,
  checked: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Route to add a task
app.post("/add-task", async (req, res) => {
  try {
    const { content, checked } = req.body;
    const newTask = new Task({ content, checked });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Route to get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Route to delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Route to update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
