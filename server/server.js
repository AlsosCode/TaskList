import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Definer __dirname for ES-moduler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let tasks = [];

// Endpoint for å hente oppgaver
app.get("/tasks", (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Henter oppgaver:", tasks);
  }
  res.json(tasks);
});

// Endpoint for å legge til en oppgave
app.post("/tasks", (req, res) => {
  const newTask = { text: req.body.text, completed: false };
  tasks.push(newTask);
  if (process.env.NODE_ENV !== "production") {
    console.log("Ny oppgave lagt til:", newTask);
  }
  res.json(newTask);
});

// Endpoint for å fjerne fullførte oppgaver
app.delete("/tasks/completed", (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Forespørsel mottatt for å slette fullførte oppgaver");
    console.log("Oppgaveliste før sletting:", tasks);
  }
  tasks = tasks.filter((task) => task.completed !== true);
  if (process.env.NODE_ENV !== "production") {
    console.log("Oppgaveliste etter sletting:", tasks);
  }
  res.json(tasks);
});

// Endpoint for å oppdatere oppgavestatus
app.patch("/tasks/:index", (req, res) => {
  const index = req.params.index;
  if (tasks[index]) {
    tasks[index].completed = req.body.completed;
    if (process.env.NODE_ENV !== "production") {
      console.log("Oppgave oppdatert:", tasks[index]);
    }
    res.json(tasks[index]);
  } else {
    console.error("Oppgave ikke funnet for oppdatering, indeks:", index);
    res.status(404).send("Oppgave ikke funnet");
  }
});

// Serve static files from React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
