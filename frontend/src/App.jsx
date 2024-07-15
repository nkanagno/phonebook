import { useState,useEffect } from 'react'
import Persons from './components/Persons.jsx';
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import phonebooks from './services/phonebooks.js';
import Notification from './components/Notification.jsx';
const App = () => {

  // Use States (persons,newName,newNumber,searchName):
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [message,setMessage] = useState(null)
  const [messageType,setMessageType] = useState('message')



  // load persons data from the server
  useEffect(()=>{
    console.log("effect")

    phonebooks
      .getAll()
      .then(phonebook =>{
        console.log(phonebook)
        setPersons(phonebook)
      })
  },[])

  
  // check for existing person
  function nameExists(person){
    const personsArray = persons.map(person => person.name)
    if (personsArray.includes(person)) return true;
  }

  // add new person
  const AddPerson = (event) => {
    // prevent empty values
    event.preventDefault()
    if(newName==="" || newNumber ==="") return

    // if name exists show message
    if(nameExists(newName) === true){
      
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one (${newNumber})`)) {
        // find person and create newNumber object
        const person = persons.find(p => p.name === newName)
        const changedPersonphone = { ...person, number: newNumber }
        
        // update phone
        phonebooks
          .update(person.id, changedPersonphone).then(returnedNote => {
              setPersons(persons.map(person => person.name !== newName ? person : returnedNote))
              setMessageType('message')
              setMessage(`${newName} number updated`)
              setTimeout(() => {
                setMessage(null)
              }, 3000);
          })
        }
        setNewNumber('')
        setNewName('')
        return
      }

    // create new person and send it to server
    const person = {
      name:newName,number:newNumber,id:(persons.length+1).toString()
    }
    phonebooks.create(person)
    .then(phonebook => {
      console.log(phonebook)
      setPersons(persons.concat(phonebook))
      setMessageType('message')
      setMessage(`Added ${newName}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000);
    
      setNewName('')
      setNewNumber('')
    })
      .catch((error) => {
        setMessageType('error')
        setMessage(error.response.data.error)
        setTimeout(() => {
        setMessage(null)
      }, 3000);
    
      setNewName('')
      setNewNumber('')
      });
    
    console.log("button clicked")
  }
  
  // update values on each key down
  const handleNameChange = (event) =>{
    setNewName(event.target.value)
    console.log(newName)
  }
  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
    console.log(newNumber)
  }
  const handleSearchNameChange = (event) =>{
    setSearchName(event.target.value)
    console.log(searchName)
  }

  // handle search filter
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      
      <h2>Phonebook</h2>
      <Notification message={message} type = {messageType}/>
      <Filter searchName = {searchName} handleSearchNameChange={handleSearchNameChange}/>
      
      <h1>add a new</h1>
      <PersonForm  AddName={AddPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} setPersons={setPersons} setMessage={setMessage} setMessageType={setMessageType}/>
    </div>
  )
}

export default App