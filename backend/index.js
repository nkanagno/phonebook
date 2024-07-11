const express = require('express')

const app = express()
const cors = require("cors");

app.use(cors());
app.use(express.json())
const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  if(req.method =='POST'){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
].join(' ')
}))
let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/info', (request, response) => {
    const peopleLen = persons.length
    const date = new Date()
    const InfoHtml = `<p>Phonebook has info for ${peopleLen} people</p><p>${date}</p>`
    response.send(InfoHtml)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send({ error: 'person not found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const getRandomId = (max) => Math.floor(Math.random() * max)

const personExists = (name) => {
    return persons.some(person => person.name === name)
}



app.post('/api/persons', (request, response) => {
    const body = request.body
    

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'content missing' })
    }

    if (personExists(body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        id: (getRandomId(100000)).toString(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`root is running on http://localhost:${PORT}/`)
    console.log(`info is running on http://localhost:${PORT}/info`)
    console.log(`data (person) are running on http://localhost:${PORT}/api/persons`)
})
