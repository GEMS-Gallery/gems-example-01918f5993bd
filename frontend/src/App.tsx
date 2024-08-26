import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const Display = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontSize: '2rem',
    textAlign: 'right',
  },
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operation) {
      const result = await backend.calculate(operation, firstOperand, inputValue);
      if ('ok' in result) {
        setDisplay(result.ok.toString());
        setFirstOperand(result.ok);
      } else {
        setDisplay('Error');
      }
    }

    setWaitingForSecondOperand(true);
    setOperation(nextOperation);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Display
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{ readOnly: true }}
        />
        <Grid container spacing={1} mt={2}>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <CalculatorButton
                fullWidth
                variant="contained"
                onClick={() => btn === '.' ? inputDecimal() : inputDigit(btn)}
              >
                {btn}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="secondary"
              onClick={clear}
            >
              C
            </CalculatorButton>
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1}>
          {['+', '-', '*', '/'].map((op) => (
            <Grid item xs={3} key={op}>
              <CalculatorButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => performOperation(op)}
              >
                {op}
              </CalculatorButton>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <CalculatorButton
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => performOperation('=')}
          >
            =
          </CalculatorButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
