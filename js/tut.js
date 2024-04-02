/* Learning all the JS I need to know for react
 * Extended from https://www.youtube.com/watch?v=m55PTVUrlnA
*/

// Normal JS functions
function DoSomething() {
  console.log("Doing something");
}

// Unlike Python, you have to explicitly export functions you want to use elsewhere
// The 'default' keyword allows us to import the function with another name (I think?)
export default function DoSomething() {
  console.log("Doing something");
}

// Newer version of JS often uses arrow functions
const DoSomethingElse = () => {
  console.log("Doing something else");
}

// You can also export arrow functions, but you just need to start with `export`
export const DoSomethingElse = () => {
  console.log("Doing something else");
}

// You can also use anonymous functions (equivalent to a lambda expression?)
( () => {console.log("Doing something with an anonymous function"); })();

/* 
 * Control flow and conditionals
*/
if (true) {
  console.log("True");
} else {
  console.log("False");
}

// Ternary operators
true ? console.log("True") : console.log("False");

/* 
 * Variable declarations
*/
// In OG JS, there was only `var`, but now we have `let` and `const` too
function foo() {
  let x = 5; // this is mutable and only has block scope
  const Y = 5; // this is immutable and only has block scope
  var z = 5; // this is mutable and has function scope
}
// None of these are accessible outside of the function

// We can also do a version of ternary operator for variable assignment
let x = true ? 5 : 6; // if `true`, then `x` is 5, else `x` is 6 -> in python this would be `x = 5 if True else 6`

/* 
 * Objects (equivalent to python dictionaries) and arrays (equivalent to python lists)
*/
const person = {
  name: "Alice",
  age: 30,
  hobbies: ["music", "movies", "sports"],
  isMarried: false,
};
// We can access these properties directly with dot notation
console.log(person.name);
// But it's often more concise to use destructuring
const { name, age, hobbyList, isMarried} = person;
// There's are some handy tricks for this
const { name: firstName } = person;
// If the variable and property names are the same, you can just use the variable name
let name = "Bob"
const person2 = {
  name, // this is equivalent to `name: name` because the variable name is the same as the property name
  age: 69,
}
const person3 = {...person, name: "Eve"} // We copy everything from `person`, but overwrite the `name` property
// This also works with arrays
const names = ["Alice", "Bob", "Eve"];
const names2 = [...names, "Dave"]; // We copy everything from `names`, but add "Dave" to the end

// Optional chaining is really helpful for accessing nested properties that might not exist
const someProperty = person.hobbies?.[0]; // This is equivalent to `person.hobbies && person.hobbies[0]`


/*
 * Array functions
 * .map() lets us apply a function to every element in an array
 * .filter() lets us filter an array based on a condition
 * .reduce() lets us reduce an array to a single value
*/
let hobbies = ["music", "movies", "sports"];

// We can use `map` to apply an (anonymous) function to every element in an array
hobbies.map( (h) => { return "Hobby: " + h} ); // This gives [ "Hobby: music", "Hobby: movies", "Hobby: sports" ]

// We can use `filter` to filter an array based on a condition
hobbies.filter( (h) => { return h.startsWith("m") } ); // This gives [ "music", "movies" ]

// We can use `reduce` to reduce an array to a single value
hobbies.reduce( (sum, h) => { return sum + h.length }, 0 ); // This gives 16

/*
 * Asynchronous functions
 * Async functions are functions that return a promise
 * Await functions are functions that wait for a promise to resolve
 * Fetch gets data from a URL
*/ 

async function getTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();
  return data;
}

/* 
 * Modern JS import/export syntax (as used in React)
*/
// Importing a default export
import DoSomething from "./tut.js";
// Importing a named export (note that you can rename the import with `as`)
import { DoSomethingElse as DoSomethingElse2 } from "./tut.js";

/* 
 * String manipulation
 * .split() splits a string into an array
 * .join() joins an array into a string
 * .trim() removes whitespace from the start and end of a string
 * .replace() replaces a substring with another substring
 * .includes() checks if a string contains another string
 * .startsWith() checks if a string starts with another string
 * .endsWith() checks if a string ends with another string
*/

// Template literals in JS are like f-strings in python. We use backticks instead of quotes
const name = "Alice";
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old`;


























