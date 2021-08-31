/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { NewPatient, Gender, NewHealthCheckEntry, HealthCheckRating, NewHospitalEntry, Discharge, NewEntry, NewOccupationalHealthcareEntry, SickLeave } from "./types";

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  //checks that the full name is between 1 to 5 names in total
  if (name.split(" ").length < 1 || name.split(" ").length > 5) {
    throw new Error('Too many or too few names');
  }
  return name;
};

const isDate = (date: string): boolean => {
  //checks that the date given is an actual date
  return Boolean(Date.parse(date));
};

const parseDate = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
      throw new Error('Incorrect or missing date: ' + dateOfBirth);
  }
  return dateOfBirth;
};

const isSSN = (ssn: string): boolean => {
  //checks that the ssn length is correct and that the '-' is at the right position
  if (ssn.length !== 11 || ssn.charAt(6) !== '-') {
    return false;
  }
  return true;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn) || !isSSN(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};


const isGender = (param: any): param is Gender => {
  //checks that the given gender fits the enum type
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description: ' + description);
  }
  return description;
};

const isDiagnosisCodes = (diagnosisCodes: unknown[]): boolean => {
  let checker = true;
  diagnosisCodes.map(code => {
    if (!isString(code)) {
      checker = false;
    }
  });
  return checker;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): string[] => {
  if (!diagnosisCodes || !Array.isArray(diagnosisCodes) || !isDiagnosisCodes(diagnosisCodes)) {
    throw new Error('Incorrect diagnosis codes: ' + diagnosisCodes);
  }
  return diagnosisCodes;
};

const isType = (type: unknown): boolean => {
  if (type === 'HealthCheck' || type === 'Hospital' || type === 'OccupationalHealthcare') {
    return true;
  }
  return false;
};

const parseType = (type: unknown): string => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }
  return type;
};


const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseRating = (healthCheckRating: unknown): number => {
  if (!isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing health check rating: ' + healthCheckRating);
  }
  return healthCheckRating;
};

const parseDischarge = (discharge: any): Discharge => {
  if (!discharge || !isDate(discharge.date) || !isString(discharge.criteria)) {
    throw new Error('Incorrect or missing discharge information: ' + discharge.date + discharge.criteria);
  }
  return discharge;
};

const parseSickLeave = (sickLeave: any): SickLeave => {
  if (!sickLeave || !isDate(sickLeave.startDate) || !isDate(sickLeave.endDate)) {
    throw new Error('Incorrect or missing sickleave information: ' + sickLeave);
  }
  return sickLeave;
};


type Fields = { name : unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NewPatient => {
  //a function that checks each input value to make sure that errors are catched and handled
  //and the value types are what is expected of them
  const newPatientToAdd: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSSN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: []
  };
  return newPatientToAdd;
};

type HealthCheckFields = {description : unknown, date : unknown, specialist : unknown, diagnosisCodes? : unknown, type : unknown, healthCheckRating : unknown};

export const toNewHealthCheckEntry = ({ description, date, specialist, diagnosisCodes, type, healthCheckRating }:HealthCheckFields): NewHealthCheckEntry => {
  //a function that checks each input value to make sure that errors are catched and handled
  //and the value types are what is expected of them
  parseType(type);
  const newEntryToAdd: NewHealthCheckEntry = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseName(specialist),
    type: "HealthCheck",
    healthCheckRating: parseRating(healthCheckRating)
  };
  if (diagnosisCodes && diagnosisCodes !== []) {
    newEntryToAdd.diagnosisCodes = parseDiagnosisCodes(diagnosisCodes);
  }
  return newEntryToAdd;
};

type HospitalFields = {description : unknown, date : unknown, specialist : unknown, diagnosisCodes? : unknown, type : unknown, discharge : unknown};

export const toNewHospitalEntry = ({ description, date, specialist, diagnosisCodes, type, discharge}:HospitalFields): NewHospitalEntry => {
  //a function that checks each input value to make sure that errors are catched and handled
  //and the value types are what is expected of them
  parseType(type);
  const newEntryToAdd: NewHospitalEntry = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseName(specialist),
    type: "Hospital",
    discharge: parseDischarge(discharge)
  };
  if (diagnosisCodes && diagnosisCodes !== []) {
    newEntryToAdd.diagnosisCodes = parseDiagnosisCodes(diagnosisCodes);
  }
  return newEntryToAdd;
};

type OccupationalCheckFields = {description : unknown, date : unknown, specialist : unknown, diagnosisCodes? : unknown, type : unknown, employerName : unknown, sickLeave? : unknown};

export const toNewOccupationalEntry = ({ description, date, specialist, diagnosisCodes, type, employerName, sickLeave}: OccupationalCheckFields): NewOccupationalHealthcareEntry => {
  //a function that checks each input value to make sure that errors are catched and handled
  //and the value types are what is expected of them
  parseType(type);
  const newEntryToAdd: NewOccupationalHealthcareEntry = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseName(specialist),
    type: "OccupationalHealthcare",
    employerName: parseName(employerName)
  };
  if (diagnosisCodes && diagnosisCodes !== []) {
    newEntryToAdd.diagnosisCodes = parseDiagnosisCodes(diagnosisCodes);
  }
  if (Array.isArray(sickLeave) && sickLeave[0] !== '' && sickLeave[1] !== '' ) {
    newEntryToAdd.sickLeave = parseSickLeave(sickLeave);
  }
  return newEntryToAdd;
};


type EntryFields = {description : unknown, date : unknown, specialist : unknown, diagnosisCodes? : unknown, type : unknown, discharge? : unknown, healthCheckRating? : unknown, employerName? : unknown, sickLeave? : unknown};

export const toNewEntry = ({ description, date, specialist, diagnosisCodes, type, discharge, healthCheckRating, employerName, sickLeave }: EntryFields): NewEntry | undefined => {
  //a function that calls entry validation functions depending on the type given as a parameter
  parseType(type);
  if (type === 'HealthCheck') {
    return toNewHealthCheckEntry({ description: description, date: date, specialist: specialist, diagnosisCodes: diagnosisCodes, type: type, healthCheckRating: healthCheckRating });
  } else if (type === 'Hospital') {
    return toNewHospitalEntry({ description: description, date: date, specialist: specialist, diagnosisCodes: diagnosisCodes, type: type, discharge: discharge});
  } else if (type === 'OccupationalHealthcare') {
    return toNewOccupationalEntry({ description: description, date: date, specialist: specialist, diagnosisCodes: diagnosisCodes, type: type, employerName: employerName, sickLeave: sickLeave});
  }
  return undefined;
};

export default toNewPatient;