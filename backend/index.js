// requirements
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Phonebook = require('./models/phonebook.js')
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./errorHandler.js')
require('mongoose')


// APP
const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  if(req.method ==='POST'){
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



app.get('/info', (request, response) => {
  Phonebook.find({})
    .then((persons) => {
      const peopleLen = persons.length
      const date = new Date()
      const InfoHtml = `<p>Phonebook has info for ${peopleLen} people</p><p>${date}</p>`
      response.send(InfoHtml)
    })
    .catch((error) => {
      console.error(error)
      response.status(500).send('Error retrieving information')
    })
})

app.use(requestLogger)
// get all request
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then((persons) => {
    response.json(persons)
  })
})

app.use(express.json())
// get request by id
app.get('/api/persons/:id', (request, response,next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})


const personExists = (name) => {
  Phonebook.findOne({ name }).then(person => {
    console.log(person)
    if (person) {
      return true
    } else {
      return false
    }
  })
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (personExists(body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })
  person.save().then((savedPerson) => {
    response.json(savedPerson)
  }).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})


app.use(unknownEndpoint)
// use Errors handlers
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
