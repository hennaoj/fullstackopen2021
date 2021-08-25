import { NewPatient, Gender } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  //checks that the full name is between 2 to 5 names in total
  if (name.split(" ").length < 2 || name.split(" ").length > 5) {
    throw new Error('Too many or too few names');
  }
  return name;
};

const isDate = (date: string): boolean => {
  //checks that the date given is an actual date
  return Boolean(Date.parse(date));
};

const parseDoF = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
      throw new Error('Incorrect or missing date of birth: ' + dateOfBirth);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

type Fields = { name : unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NewPatient => {
  //a function that checks each input value to make sure that errors are catched and handled
  //and the value types are what is expected of them
  const newPatientToAdd: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDoF(dateOfBirth),
    ssn: parseSSN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: []
  };
  return newPatientToAdd;
};

export default toNewPatient;