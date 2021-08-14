const validation = require('../validation/main');
const diff = require('diff');
const map = require('lodash.map');

const US = `United States`;
const CAN = `Canada`;
const MEX = `Mexico`;

validation.validators.carYear = (target) => validation.isNumber(target) && target >= 1885 && target < new Date().getFullYear();
validation.validators.evenNumber = (target) => validation.isNumber(target) && target % 2 == 0;
validation.validators.country = (target) => validation.isString(target) && (target == US || target == CAN || target == MEX);

validation.definedTypes.address = {
  streetAddress: `string`,
  country: `country`
}

validation.definedTypes.company = {
  companyName: `string`,
  address: `address`
}

validation.definedTypes.tire = {
  expectedLifeSpan: `date`,
};

validation.definedTypes.car = {
  id: `number`,
  model: `string`,
  year: `carYear`,
  isUsed: `bool`,
  numberOfTailLights: `evenNumber`,
  tires: `tire[]`,
  make: `company`
};

let validCar = {
  id: 224873,
  model: `Focus`,
  year: 2010,
  isUsed: true,
  numberOfTailLights: 2,
  tires: [
    { expectedLifeSpan: `11/11/2011` },
    { expectedLifeSpan: `12/12/2012` },
    { expectedLifeSpan: `12/12/2012` },
    { expectedLifeSpan: `12/12/2012` },
  ],
  make: {
    companyName: `Ford`,
    address: {
      streetAddress: `1800 Ford Drive`,
      country: `United States`
    }
  }
};

let invalidCar = {
  make: 'ford',
  model: {
    hello: `world`
  },
  color: 'blue',
  tires: [
    { expectedLifeSpan: `graa` },
    { expectedLifeSpan: `12/12/2012` },
    { expectedLifeSpan: `12/12/2012` },
    { expectedLifeSpan: `12/12/2012` },
  ],
};

const validResult = JSON.stringify(validation.isInvalid(validCar, `car`), null, 2);
if (validResult !== `null`) throw Error(`validCar had invalidation messages: ${validResult}`);

const expectedInvalidations = [
  {
    "hierarchy": "car.id",
    "expectedType": "number",
    "actualValue": null
  },
  {
    "hierarchy": "car.model",
    "expectedType": "string",
    "actualValue": {
      "hello": "world"
    }
  },
  {
    "hierarchy": "car.year",
    "expectedType": "carYear",
    "actualValue": null
  },
  {
    "hierarchy": "car.isUsed",
    "expectedType": "bool",
    "actualValue": null
  },
  {
    "hierarchy": "car.numberOfTailLights",
    "expectedType": "evenNumber",
    "actualValue": null
  },
  {
    "hierarchy": "car.tires[0].expectedLifeSpan",
    "expectedType": "date",
    "actualValue": "graa"
  },
  {
    "hierarchy": "car.make",
    "expectedType": "company",
    "actualValue": "ford"
  }
];

const resultingInvalidations = validation.isInvalid(invalidCar, `car`);
const resultDifferences = diff.diffJson(expectedInvalidations, resultingInvalidations);
if (resultDifferences.length > 1) {
  const diffLog = map(resultDifferences, (change) => `${change.added ? `ACTUAL:` : change.removed ? `EXPECTED:` : ` `} ${change.value}`).join(``);
  throw Error(`There were unexpected differences in validation messages: ${diffLog}`);
}

console.log(`Tests successfully completed!`);
