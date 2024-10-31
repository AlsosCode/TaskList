import React, { useState, useEffect } from "react";
import "./App.css";

// Komponent for å legge til oppgaver
function AddTask({ addTask }) {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (task.trim()) {
      addTask(task);
      setTask("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Skriv en oppgave..."
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleAdd}>Legg til</button>
    </div>
  );
}

// Komponent for å vise oppgaver
function TaskList({ tasks, toggleTask }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(index)}
          />{" "}
          {task.text}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/tasks`); // Bruker relativ URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Feil ved henting av oppgaver:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (text) => {
    try {
      const response = await fetch(`/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Feil ved å legge til oppgave:", error);
    }
  };

  const toggleTask = async (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);

    try {
      const response = await fetch(`/tasks/${index}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: updatedTasks[index].completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Feil ved oppdatering av oppgave:", error);
    }
  };

  const removeCompletedTasks = async () => {
    try {
      const response = await fetch(`/tasks/completed`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedTasks = await response.json();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Feil ved å fjerne fullførte oppgaver:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Huskeliste</h1>
        <AddTask addTask={addTask} />
        <TaskList tasks={tasks} toggleTask={toggleTask} />
        <button className="remove-button" onClick={removeCompletedTasks}>
          Fjern markerte
        </button>
      </header>
    </div>
  );
}

export default App;
