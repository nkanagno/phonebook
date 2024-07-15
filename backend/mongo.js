const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://nikolasanagnost:${password}@cluster0.icw3ibz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name != null && number != null) {
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((result) => {
    console.log(`added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
  
} else {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    if (result.length === 0) console.log("no results");
    mongoose.connection.close();
  });
}
