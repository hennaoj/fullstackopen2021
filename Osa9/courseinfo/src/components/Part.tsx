import React from 'react';
import { CoursePart } from '../App';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({part}:{part: CoursePart}) => {
  switch(part.type) {
    case "normal":
      //attributes name, exerciseCount, description
      return (
        <div>
          <p><b>{part.name} {part.exerciseCount}</b></p>
          <p><i>{part.description}</i></p>
        </div>
      )
    case "groupProject":
      //attributes name, exerciseCount, groupProjectCount
      return (
        <div>
          <p><b>{part.name} {part.exerciseCount}</b></p>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      )
    case "submission":
      //attributes name, exerciseCount, description, exerciseSubmissionLink
      return (
        <div>
          <p><b>{part.name} {part.exerciseCount}</b></p>
          <p><i>{part.description}</i></p>
          <p>submit to {part.exerciseSubmissionLink}</p>
        </div>
      )
    case "special":
      //attributes name, exerciseCount, description, requirements
      return (
        <div>
          <p><b>{part.name} {part.exerciseCount}</b></p>
          <p><i>{part.description}</i></p>
          <p>required skills: {part.requirements.map(requirement =>
            <li key={requirement}>{requirement}</li>
          )}</p>
        </div>
      )
    default:
      return assertNever(part)
  }
}

export default Part;