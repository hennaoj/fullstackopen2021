import { Entry } from "../types";
import React from 'react';
import { SemanticCOLORS, SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { Icon, Card } from "semantic-ui-react";
import { useStateValue } from "../state";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({entry}: {entry: Entry}) => {
  //returns all details of an entry, specifying the type with a semanticicons icon

  let icon: SemanticICONS;
  const [{ diagnoses }] = useStateValue(); //fetching the diagnoses from the state to find the diagnoses matching to the entry codes

  //using switch case for different entry types to get all needed attributes
  switch (entry.type) {
    case "HealthCheck":
      const healthRating: SemanticICONS = 'heart';
      let color: SemanticCOLORS;

      //using a heart icon's color to show the health rating
      if (entry.healthCheckRating === 0) {
        color = 'green';
      } else if (entry.healthCheckRating === 1) {
        color = 'yellow';
      } else if (entry.healthCheckRating === 2) {
        color = 'orange';
      } else {
        color = 'red';
      }
      icon = 'doctor';
      return (
        <Card fluid={true} margin-left={300}>
          <Card.Content>
          <h3>{entry.date} <Icon name={icon}/></h3>
          <p><i>{entry.description}</i></p>
          <Icon name={healthRating} color={color}/>
          <ul>
            {entry.diagnosisCodes && Object.values(entry.diagnosisCodes).map(code => {
              return <li key={code}>{code} {' '} {diagnoses[code]?.name}</li>;
            })}
          </ul>
          </Card.Content>
        </Card>
      );
    case "Hospital":
      icon = 'hospital';
      return (
        <Card fluid={true}>
          <Card.Content>
          <h3>{entry.date} <Icon name={icon}/></h3>
          <p><i>{entry.description}</i></p>
          <ul>
            {entry.diagnosisCodes && Object.values(entry.diagnosisCodes).map(code => {
              return <li key={code}>{code} {' '} {diagnoses[code]?.name}</li>;
            })}
          </ul>
          <p>discharge date: {entry.discharge.date}</p>
          <p>discharge criteria: {entry.discharge.criteria}</p>
          </Card.Content>
        </Card>
      );
    case "OccupationalHealthcare":
      icon = 'medkit';
      return (
        <Card fluid={true}>
          <Card.Content>
          <h3>{entry.date} <Icon name={icon}/> {entry.employerName}</h3>
          <p><i>{entry.description}</i></p>
          <ul>
            {entry.diagnosisCodes && Object.values(entry.diagnosisCodes).map(code => {
              return <li key={code}>{code} {' '} {diagnoses[code]?.name}</li>;
            })}
          </ul>
          {entry.sickLeave &&
            <div>
              <p>sick leave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
            </div>
          }
          </Card.Content>
        </Card>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;