import React from 'react';
import Part from './Part'
import { CoursePart } from '../App';

const Content = ({parts}:{parts: CoursePart[]}) => {
  return (
    <div>
    {parts.map(part => 
      <div key={part.name}>
        <Part part={part}/>
      </div>)}
    </div>
  );
};

export default Content