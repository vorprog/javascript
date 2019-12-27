const map = require('lodash.map')

const isType = (target, type) => target && typeof (target) === type;
const arrayTypeSymbol = `[]`;

const validators = {
    function: (target) => isType(target, `function`),
    symbol: (target) => isType(target, `symbol`),
    object: (target) => isType(target, `object`) && !Array.isArray(target),
    array: (target) => isType(target, `object`) && Array.isArray(target),
    bool: (target) => isType(target, `boolean`),
    number: (target) => isType(target, `number`),
    bigint: (target) => isType(target, `bigint`),
    string: (target) => isType(target, `string`) && target.trim() !== ``,
    isString: (target) => isType(target, `string`) && target.trim() !== ``,
    alphaNumeric: (target) => validators.isString(target) && /^[a-zA-Z0-9]*$/.test(target),
    informalPhoneNumber: (target) => validators.isString(target) && /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(target),
    email: (target) => validators.isString(target) && /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(target),
    date: (target) => validators.isString(target) && isNaN(Date.parse(target)) == false
};

const definedTypes = {};

const getInvalidations = (target, typeName, hierarchy = typeName) => {
    if (validators[typeName]) return validators[typeName](target) ? null : [ { hierarchy: hierarchy, invalidatedType: typeName}];

    let invalidations = [];

    if (typeName.indexOf(arrayTypeSymbol) != -1) {
        let nonArrayTypeName = typeName.replace(arrayTypeSymbol, ``);

        if (!validators.array(target)) return [ { hierarchy: hierarchy, invalidatedType: typeName} ];

        for (i = 0; i < target.length; i++) {
            let innerInvalidations = getInvalidations(target[i], nonArrayTypeName, `${hierarchy}[${i}]`);
            if (innerInvalidations) invalidations = invalidations.concat(innerInvalidations);
        }

        return invalidations;
    }

    let definedType = definedTypes[typeName];

    if (!definedType) throw new Error(`No type defined for: ${typeName}`);

    map(definedType, (propertyTypeName, propertyName) => {
        let innerInvalidations = getInvalidations(target && target.hasOwnProperty(propertyName) && target[propertyName] || null, propertyTypeName, `${hierarchy}.${propertyName}`);
        if (innerInvalidations) invalidations = invalidations.concat(innerInvalidations);
    });

    return invalidations.length == 0 ? null : invalidations;
};

module.exports = {
    validate: (target, typeName) => {
        let invalidations = getInvalidations(target, typeName);
        if (invalidations) throw invalidations;
        return true;
    },
    isInvalid: (target, typeName) => getInvalidations(target, typeName),

    isFunction: (target) => validators.function(target),
    isSymbol: (target) => validators.symbol(target),
    isObject: (target) => validators.object(target),
    isArray: (target) => validators.array(target),
    isBool: (target) => validators.bool(target),
    isNumber: (target) => validators.number(target),
    isBigInt: (target) => validators.bigint(target),
    isString: (target) => validators.string(target),
    isAlphaNumeric: (target) => validators.alphaNumeric(target),
    isInformalPhoneNumber: (target) => validators.informalPhoneNumber(target),
    isEmail: (target) => validators.email(target),
    isDate: (target) => validators.date(target),
    definedTypes: definedTypes,
    validators: validators
};