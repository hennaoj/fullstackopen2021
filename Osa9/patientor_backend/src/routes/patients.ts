/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  res.send(patientService.getPatientData(req.params.id));
});

router.post('/', (req, res) => {
  try {
    //first checking that the req.body values are in correct format using toNewPatient
    const newPatient = toNewPatient(req.body);
    //adding the patient
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;