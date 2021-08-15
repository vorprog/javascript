const loop = require('../loop/main').loop;
const kvp = require('../loop/main').keyValuePair;

const evenNumbers = [2, 4, 6, 8, 10];
const words = [`foo`, `bar`, `blee`, `bla`, `meh`];

const car1 = {
  make: `Tesla`,
  model: `Cyber Truck`,
  year: `2021`,
  stock: 100,
  isElectric: true
};

const car2 = {
  make: `Ford`,
  model: `Mustang`,
  year: `1966`,
  stock: 7,
  isElectric: false
};

const assertJsonEquivalence = (a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error();
};

console.log(`evenNumbers >>> ${JSON.stringify(evenNumbers)}`);
console.log(`car >>> ${JSON.stringify(car1)}`);

const evenNumbersDoubled = loop(evenNumbers, (key, value) => value * 2);
console.log(`evenNumbersDoubled  >>> ${JSON.stringify(evenNumbersDoubled)}`);
assertJsonEquivalence(evenNumbersDoubled, [4, 8, 12, 16, 20]);

const descendingEvenNumbers = loop(evenNumbers, (key, value) => new kvp(evenNumbers.length - (key + 1), value));
console.log(`descendingEvenNumbers  >>> ${JSON.stringify(descendingEvenNumbers)}`);
assertJsonEquivalence(descendingEvenNumbers, [10, 8, 6, 4, 2]);

const filteredNumbers = loop(evenNumbers, (key, value) => (value > 6 ? value : null));
console.log(`filteredNumbers >>> ${JSON.stringify(filteredNumbers)}`);
assertJsonEquivalence(filteredNumbers, [8, 10]);

const randomWordValues = loop(car1, (key, value, completedIterations) => new kvp(key, words[completedIterations]));
console.log(`randomWordValues >>> ${JSON.stringify(randomWordValues)}`);
assertJsonEquivalence(randomWordValues, { make: `foo`, model: `bar`, year: `blee`, stock: `bla`, isElectric: `meh` });

const changedCarValues = loop(car1, key => car2[key]);
console.log(`changedCarValues >>> ${JSON.stringify(changedCarValues)}`);
assertJsonEquivalence(changedCarValues, [`Ford`, `Mustang`, `1966`, 7, false]);

const reKeyedCarObject = loop(car1, (key, value, completedIterations) => new kvp(words[completedIterations], value));
console.log(`reKeyedCarObject >>> ${JSON.stringify(reKeyedCarObject)}`);
assertJsonEquivalence(reKeyedCarObject, { foo: `Tesla`, bar: `Cyber Truck`, blee: `2021`, bla: 100, meh: true });

const carValuesArray = loop(car1, (key, value) => value);
console.log(`carValuesArray >>> ${JSON.stringify(carValuesArray)}`);
assertJsonEquivalence(carValuesArray, [`Tesla`, `Cyber Truck`, `2021`, 100, true]);

const countBy10 = loop(10, key => key * 10);
console.log(`countBy10 >>> ${JSON.stringify(countBy10)}`);
assertJsonEquivalence(countBy10, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90])

console.log(`All tests have passed!`);
