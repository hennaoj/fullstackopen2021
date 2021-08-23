import React from 'react';

interface CourseParts {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  parts: CourseParts[];
}

const Total = (props: TotalProps) => {
  return (
      <p>Number of exercises{" "} {props.parts.reduce((carry, part) => carry + part.exerciseCount, 0)}</p>
  );
};

export default Total