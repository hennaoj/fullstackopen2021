interface Inputs {
  target: number;
  hours: number[];
}

export interface exerciseResults {
  periodLength: number;
  trainingDays: number;
  average: number;
  target: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

const parseExerciseArguments = (args: Array<string>): Inputs => {
  if (args.length < 4) throw new Error('Not enough arguments');

  let target: number;
  if (!isNaN(Number(args[2]))) {
    target = Number(args[2]);
  } else {
    throw new Error('Provided values were not numbers');
  }
 
  const exerHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {
      exerHours.push(Number(args[i]));
    } else {
      throw new Error('Provided values were not numbers');
    }
  }

  return {
    target: target,
    hours: exerHours
  };

};

export const calculateExercises = (exerciseHours: number[], targetHours: number): exerciseResults => {
  const length: number = exerciseHours.length;
  const days: number[] = exerciseHours.filter(hours => {
    if (hours > 0) {
      return hours;
    }
    return null;
  });
  const total: number = exerciseHours.reduce((a, b) => a + b, 0);
  const average: number = Math.round(total/length * 100) / 100;
  let success = false;
  let rating = 1;
  let ratingDesc = 'not good at all';
  if (average >= targetHours) {
    success = true;
    rating = 3;
    ratingDesc = 'excellent work!';
  } else if (average >= 0.5 * targetHours) {
    rating = 2;
    ratingDesc = 'not too bad but could be better';
  }

  return {
    periodLength: length,
    trainingDays: days.length,
    average: average,
    target: targetHours,
    success: success,
    rating: rating,
    ratingDescription: ratingDesc
  };
};

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error) {
  if (error instanceof Error) {
    console.log('Error, message: ', error.message);
  }
}