import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]); 
  const [newTodo, setNewTodo] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  const [editingText, setEditingText] = useState(""); 

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?_limit=4"
        );
        setTodos(response.data);
      } catch (error) {
        console.log("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  //Add todo
  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        { title: newTodo, completed: false }
      );
      setTodos([response.data, ...todos]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  // Save edited todo
  const saveTodoPUT = async (id) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        { title: editingText, completed: false }
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };
  // Inline styles
  const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f0f4f8",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const headerStyle = {
    textAlign: "center",
    color: "#0ea5e9",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px",
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "5px 0 0 5px",
    outline: "none",
  };

  const addButtonStyle = {
    padding: "10px 15px",
    border: "none",
    backgroundColor: "#0ea5e9",
    color: "white",
    borderRadius: "0 5px 5px 0",
    cursor: "pointer",
  };

  const todoItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const buttonStyle = {
    marginLeft: "5px",
    padding: "5px 8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Todo App (Full CRUD)</h1>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addTodo} style={addButtonStyle}>
          Add
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#555" }}>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={todoItemStyle}>
              {editingId === todo.id ? (
                <div style={{ display: "flex", flex: 1 }}>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ ...inputStyle, borderRadius: "5px" }}
                  />
                  <button
                    onClick={() => saveTodoPUT(todo.id)}
                    style={{ ...buttonStyle, backgroundColor: "#22c55e", color: "white" }}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    style={{ ...buttonStyle, backgroundColor: "#9ca3af", color: "white" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{todo.title}</span>
                  <div>
                    <button
                      onClick={() => startEditing(todo)}
                      style={{ ...buttonStyle, backgroundColor: "#3b82f6", color: "white" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{ ...buttonStyle, backgroundColor: "#ef4444", color: "white" }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
