interface Stats {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): Stats => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    const height: number = Number(args[2]);
    const weight: number = Number(args[3]);
    if (height > 140 && height < 230 && weight > 30 && weight < 200) {
      return {
        height: height,
        weight: weight
      }
    } else {
      throw new Error('Height should be between 140 and 230 centimeters and weight between 30 and 200 kilograms!');
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateBmi = (height: number, weight: number) => {
  const bmi: number = Math.round(( weight / (height/100) ** 2 )*10)/10;
  //console.log(bmi);
  if (bmi<16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi >= 16 && bmi < 16.9) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi >= 17 && bmi < 18.4) {
    return 'Underweight (Mild thinness)';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal (healthy weight)';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Overweight (Pre-obese)';
  } else if (bmi >= 30 && bmi < 34.9) {
    return 'Obese (Class I)';
  } else if (bmi >= 35 && bmi < 39.9) {
    return 'Obese (Class II)';
  } else if (bmi >= 40) {
    return 'Obese (Class III)';
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error) {
  console.log('Error, message: ', error.message);
}