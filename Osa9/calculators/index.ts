import express from 'express';
const app = express();
app.use(express.json());
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, exerciseResults } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const query = req.query;
  if (!query.height || !query.weight) {
    return res.status(400).json({ error: 'malformatted parameteres' });
  }
  if (!Number(query.height) || !Number(query.weight)) {
    return res.status(400).json({ error: 'malformatted parameteres' });
  }
  const height = Number(query.height);
  const weight = Number(query.weight);
  const bmi: string = calculateBmi(height, weight);
  const response = {
    height: height,
    weight: weight,
    bmi: bmi
  };
  return res.send(response);
});

app.post('/exercises', (request, res) => {
  //console.log(request.body);
  if (request.body.daily_exercises === undefined || request.body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing'});
  } else if (!Number(request.body.target)) {
    return res.status(400).json({ error: 'malformatted parameters'});
  }

  const target = Number(request.body.target);
  const hours: number[] = request.body.daily_exercises;

  if (!(hours instanceof Array)) {
    return res.status(400).json({ error: 'malformatted parameters'});
  }

  for (let i = 0; i < hours.length; i++) {
    if (!isNaN(Number(hours[i]))) {
      continue;
    } else {
      return res.status(400).json({ error: 'malformatted parameters'});
    }
  }

  const result: exerciseResults = calculateExercises(hours, target);
  return res.send(result);
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});