const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.use((req, res, next) => {
  console.log(next);
  next();
});

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response, next) => {
  response.send("<h1>HELLOW, WORLDs!</h1>");
  next();
});

app.get("/", (req, res, next) => {
  console.log("HELLO");
  res.send("s");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const note = notes.find((note) => note.id === id);

  if (!note) {
    res.statusMessage = "HELLo";
    res.status(404).end();
  } else {
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const noteBody = req.body;

  if (!noteBody.content) {
    return res.status(404).json({
      error: "content missing",
    });
  }

  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;

  const note = {
    content: noteBody.content,
    important: noteBody.important || false,
    id: maxId + 1,
  };

  notes = notes.concat(note);

  res.json(note);
});

app.use((req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
