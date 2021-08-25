import patients from "../../data/patients";
import { NonSensitivePatient, NewPatient, Patient } from "../types";
import {v1 as uuid} from 'uuid';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  //used to get the patient data without the ssn
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(), //the id of a new patient is created using uuid()
    ...entry //all the other data is given to the function as a parameter
  };

  patients.push(newPatient); //adding the new patient to the list of patients
  return newPatient;
};

const getPatientData = (id: string) => {
  const patient = patients.find(patient => patient.id === id);
  return patient;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatientData
};