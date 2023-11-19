                      /*DATABASE */

/* Package initSqlJs.  
(Aaron used sqlite3) used to connect to the database. */

import initSqlJs from "https://esm.sh/sql.js";

// Creates the connection to the database

function saveDB(db) {
// Download database file
  const data = db.export(); 
  const oUrl = URL.createObjectURL(new Blob([data])); // Link to database
  const link = document.createElement("a"); // Creates an HTML invisible link
  link.href = oUrl;
  link.download = "database.db";
  link.click(); // JS will click on it to download the file
}

async function createDB() {
// Allows us to interact with the database
  const sqlPromise = initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`, //Intermediary file between our database and JS (specific to initSqlJs)
  });
  const dataPromise = fetch("/registrationForm.db") // Same with APIs, it fetches our database file.
    .then((res) => res.arrayBuffer()); // Creates a Promise 
  
  const [SQL /* connection to database */, buf /* database */] = await Promise.all([ // Another syntax for Promises (await instead of .then)
    sqlPromise,
    dataPromise,
  ]);

  const db = new SQL.Database(new Uint8Array(buf)); // Allows JS to be able to read the database (converts binary to JS) 
  return db;
}

const db = await createDB(); // Instance of the database

console.log(db); // If successful, console.log the database

           /* MAIN  */

// Alert allergies
function _alert() {
  alert("Sorry, we cannot accept your application.");
}

const allergiesOn = document.querySelector(".allergiesOn");

allergiesOn.addEventListener("change", _alert);

//Show your age

var todaysYear = 2023;
const showAge = document.querySelector(".showAge");


function calcAge(e) {
  var value = e.currentTarget.value;
  var inputDoB = new Date(value);
  var inputYear = inputDoB.getFullYear();

  var x = todaysYear - inputYear;
  showAge.innerHTML = `${x} years old`;

  if (x < 18) {
    alert("Sorry, we cannot accept underage candidates.");
  }
}

const age = document.querySelector(".age");

age.addEventListener("change", calcAge); // Change == Everytime a new user input is added

//ThankU (-> Once you submitted the form)

const form = document.querySelector(".form");

let messageSubmit = "";

function confirmBox(e) {
  e.preventDefault();
  e.stopPropagation();

  /* Insert data into database */

  // Inputs saved in a variable

  let allInputs = [
    document.querySelector("#name").value,
    document.querySelector("#dob").value,
    document.querySelector("#address").value,
    document.querySelector("#height").value,
    document.querySelector("#weight").value,
  ];

  // Turns values into string for SQLite

  let sqlValues = "INSERT INTO people (name, dob ,address, height, weight) VALUES("; // People is the name of my table on SQLite

  // Loops through them, add them to the sqlValues variable (see line above) and console.log()

  for (let i = 0; i < allInputs.length; i++) {
    sqlValues += `' ${allInputs[i]} '`;

  // If i IS NOT the last item of the array => add a comma to separate the values)

    if (i < allInputs.length - 1) {
      sqlValues += ",";
    }
  }

  // Add a closing parentesis
  sqlValues += ")";

  console.log(sqlValues);

  const res = db.exec(sqlValues); // see above
  saveDB(db); // See at the very beginning of the code

  console.log(sqlValues);

  if (messageSubmit === true) {
    alert("Your application has been submitted");
  }

  return false;
}

form.addEventListener("submit", confirmBox);
