import User from '../models/User';
import db from '../../data/dbConfig';
import moment from 'moment';

const listItems = (arr) => {
  const str = arr.join(', ');
  const idx = str.lastIndexOf(',');
  let result = '';
  if (arr.length <= 1) {
    result = str;
  } else if (arr.length === 2) {
    result = arr.join(' and ');
  } else {
    result = `${str.slice(0, idx + 1).trim()} and ${str.slice(idx + 1).trim()}`;
  }
  return result;
};

const response400 = (res, error) => res.status(400).json({ error });
const response4xx = (res, status, error) => res.status(status).json({ error });

const isVAlidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  } else {
    return false;
  }
};

const isValidPhoneNumber = (phoneNumber) => {
  if (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
};

const isValidDate = (date) => {
  const regExp = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;

  return (
    date.toString().match(regExp) &&
    moment(date.toString(), 'YYYY-MM-DD').isValid()
  );
};

const validateDate = (req, field) => {
  let error = null;
  const date = req.body[field];
  const regExp = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;

  if (
    !(
      date.toString().match(regExp) &&
      moment(date.toString(), 'YYYY-MM-DD').isValid()
    )
  ) {
    error = `${date} is not a valid date for ${field}. Specify date in the format YYYY-MM-DD`;
  }

  return error;
};

const detectUnknownFields = (req, validColumnNames) => {
  const unknownFields = Object.keys(req.body).filter(
    (key) => !validColumnNames.includes(key)
  );
  const error =
    unknownFields.length > 0
      ? `unknown field(s): ${unknownFields.join(', ')}`
      : null;
  return error;
};

const validateRequiredFields = (req, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  const error =
    missingFields.length > 0 && req.method === 'POST'
      ? `${listItems(missingFields)} must have a value and cannot be null`
      : null;
  return error;
};

const isPositiveInteger = (value) => {
  if (typeof value === 'boolean') return false;
  return Number.isInteger(Number(value)) && Number(value) > 0;
};

const validateIntegerDataTypes = (req, arrOfFields) => {
  const invalidFields = arrOfFields.filter((field) => {
    return req.body[field] !== undefined && !isPositiveInteger(req.body[field]);
  });
  const error =
    invalidFields.length > 0
      ? `${listItems(invalidFields)} must be positive integers`
      : null;
  return error;
};

const isString = (value) =>
  typeof value === 'string' && Number.isNaN(Number(value));

const validateStringTypes = (req, stringFields) => {
  const invalidFields = stringFields.filter(
    (field) => req.body[field] !== undefined && !isString(req.body[field])
  );

  return invalidFields.length > 0
    ? `fields (${listItems(invalidFields)}) must be string`
    : null;
};

const validateUniqueField = async (req, tableName, field) => {
  let error = null;
  const value = req.body[field];
  const record = await db(tableName)
    .where({ [field]: value })
    .first();

  if (record && `${record.id}` !== `${req.params.id}`) {
    error = `a record with ${field} ${value} already exists. Duplicate value is not allowed for ${field}`;
  }

  return error;
};

export {
  listItems,
  isVAlidEmail,
  isValidPhoneNumber,
  isValidDate,
  response400,
  response4xx,
  validateRequiredFields,
  validateIntegerDataTypes,
  detectUnknownFields,
  validateStringTypes,
  validateUniqueField,
  validateDate,
  isPositiveInteger,
};
