import React from 'react';
import { Slider, Typography, TextField, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';

/*
    This interface defines the props that the ControlInput component expects.
*/
interface ControlInputProps {
  label: string;                      // A string that represents the label for the input
  min:   number;                      // A number that represents the minimum value for the input
  max:   number;                      // A number that represents the maximum value for the input
  step?: number;                      // An optional number that represents the step value for the input
  value: number;                      // A number that represents the current value for the input
  onChange: (value: number) => void;  // A function that takes a number as an argument and returns void
}

/*
    This component is a slider input that allows the user to control a value within a specified range.
    It takes the following props:
    - label: a string that represents the label for the input
    - min: a number that represents the minimum value for the input
    - max: a number that represents the maximum value for the input
    - step: an optional number that represents the step value for the input (default is 1)
    - value: a number that represents the current value for the input
    - onChange: a function that takes a number as an argument and returns void
*/
const ControlInput: React.FC<ControlInputProps> = ({ label, min, max, step = 1, value, onChange }) => {
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid size={{xs:4}}>
        <Typography id="input-slider">{label}</Typography>
      </Grid>
      <Grid size={{xs:6}}>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e, value) => onChange(value as number)}
          valueLabelDisplay="off"
        />
      </Grid>
      <Grid size={{xs:2}}>
        <TextField
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          slotProps={{ htmlInput: { min, max, step, type: 'number' } }}
          variant="standard"
          size="small"
        />
      </Grid>
    </Grid>
  );
};

export default ControlInput;