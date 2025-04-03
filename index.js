const express = require("express");
const morgan = require("morgan");

const app = express();

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use(express.static("dist"));

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const deletePersonIndex = persons.findIndex((person) => person.id === id);

  if (deletePersonIndex >= 0) {
    persons.splice(deletePersonIndex, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  let randomId = Math.floor(Math.random() * 1e6);
  while (persons.find((person) => person.id === randomId)) {
    randomId = Math.floor(Math.random() * 1e6);
  }
  return String(randomId);
};

app.post("/api/persons", (req, res) => {
  const data = req.body;

  if (!data || !("name" in data) || !("number" in data)) {
    return res.status(400).send(`Invalid arguments`);
  }

  if (persons.find((person) => person.name === data.name)) {
    return res.status(400).send(`User with name ${data.name} already exists`);
  }

  const newPerson = {
    id: generateId(),
    name: data.name,
    number: data.number,
  };

  persons.push(newPerson);

  res.json(newPerson);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Application running on: http://localhost:${PORT}`);
});
