import React from "react";
import axios from "axios";
import fetchedPatients from "../fetchedPatients";

import { Patient, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "../state";
import { Button, Card, Icon } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import EntryDetails from "../components/EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientInfoPage = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
      try {
        await axios.post<Entry>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        closeModal();
      } catch (e) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error || 'Unknown error');
      }
    console.log(values);
    closeModal();
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  };

  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  
  const patientToShow = Object.values(patients).find((patient: Patient) => patient.id === id);
  const gender = patientToShow?.gender;
  const entries = patientToShow?.entries;

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    //checking if the patient page has been opened already
    //if not, the patient data is fetched
    if (patientToShow !== undefined && !(fetchedPatients.includes(patientToShow.id))) {
      void fetchPatient();
      fetchedPatients.push(patientToShow.id);
    }
  }, [dispatch]);


  let icon: SemanticICONS;
  if (gender === 'female') {
    icon = 'venus';
  } else if (gender === 'male') {
    icon = 'mars';
  } else {
    icon = 'genderless';
  }

  if (patientToShow) {
    return (
      <div className="App">
        <h2>{patientToShow.name}<Icon name={icon}/></h2>
        <p>ssn: {patientToShow.ssn}</p>
        <p>occupation: {patientToShow.occupation}</p>
        <h3>entries</h3>
        {entries && Object.values(entries).map((entry: Entry ) => {
          return (
            <Card.Group key={entry.id}>
            <EntryDetails entry={entry} />
            </Card.Group>
          ); 
        })}
        <AddEntryModal
          modalOpen={modalOpen}
          onHealthCheckSubmit={submitNewEntry}
          onHospitalEntrySubmit={submitNewEntry}
          onOccupationalEntrySubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      </div>
    );
  }
  else {
    return (
      <h2>cannot find patient</h2>
    );
  }
};

export default PatientInfoPage;