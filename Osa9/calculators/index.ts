import express from 'express';
const app = express();
import { calculateBmi } from './bmiCalculator'

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
  const height: number = Number(query.height);
  const weight: number = Number(query.weight);
  const bmi: string = calculateBmi(height, weight)
  const response = {
    height: height,
    weight: weight,
    bmi: bmi
  }
  return res.send(response)
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});