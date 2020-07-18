const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
 }

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response,) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { techs, title, url } = request.body

  const repo = { id: uuid(), techs, title, url, likes: 0 }

  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { techs, title, url,likes } = request.body
  repoIndex = repositories.findIndex(repo => (repo.id == id));

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  if (likes) {
    // ver logica pra quando não tiver esses campos ou tiver apenas o likes ele não aceitar o update
    const repo = repositories[repoIndex]
    return response.json(repo)
  }

  const repo = {
    id,
    techs,
    title,
    url,
  };

  repositories[repoIndex] = repo;

  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  repoIndex = repositories.findIndex(repo => (repo.id == id));

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  repoIndex = repositories.findIndex(repo => (repo.id == id));

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  repository = repositories[repoIndex]
  repository.likes += 1

  return response.json(repository)
});

module.exports = app;
