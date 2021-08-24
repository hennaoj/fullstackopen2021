/* eslint-disable @typescript-eslint/no-empty-interface */
export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
}

export interface Entry {}

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[]
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = Omit<Patient, 'id'>;