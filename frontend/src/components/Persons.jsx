
import Person from "./Person.jsx";
import phonebooks from '../services/phonebooks.js';

const Persons = ({ personsToShow, setPersons,setMessage,setMessageType }) => {
  // asks for confirmation
  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete user ${name}?`)) {
      phonebooks.del(id)
        .then(() => {
          // update setPersons cause it does not reload the page
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
          console.log(name, "deleted");
        })
        .catch(() => {
          setMessage(`Information of '${name}' has already been removed from the server`)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
            setMessageType('message')
          }, 3000);
        });
    }
  };
    
  return (
    <div>
      {personsToShow.map(person => (
        <Person
          deletePerson={() => deletePerson(person.id, person.name)}
          key={person.id}
          number={person.number}
          name={person.name}
        />
      ))}
    </div>
  );
};

export default Persons;