import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #FF8C00, #000000); /* Gradiente de Naranja oscuro a Negro */
`;

const CalculatorContainer = styled.div`
  width: 400px;
  height: 650px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #333333; /* Fondo gris oscuro */
`;

const InputField = styled.input`
  width: 100%;
  padding: 20px;
  font-size: 24px;
  text-align: right;
  border: none;
  outline: none;
  background-color: #d3d3d3; /* Fondo gris claro */
`;

const HistoryDisplay = styled.div`
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  text-align: left;
  color: #ffffff; /* Color blanco */
  overflow-y: auto;
  height: 80px;
`;

const KeyboardWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  justify-content: space-between;
`;

const NumbersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const OperationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BaseButton = styled.button`
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: none;
  outline: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const OperationButton = styled(BaseButton)`
  background-color: #2196f3;
  color: #ffffff;
`;

const EqualsButton = styled(BaseButton)`
  background-color: #4caf50; /* Fondo verde */
  color: #ffffff;
  box-shadow: 0 0 5px #4caf50, 0 0 15px #4caf50, 0 0 30px #4caf50, 0 0 60px #4caf50;
`;

const ClearButton = styled(BaseButton)`
  background-color: #f44336;
  color: #ffffff;
  box-shadow: 0 0 5px #f44336, 0 0 15px #f44336, 0 0 30px #f44336, 0 0 60px #f44336;
`;

const NavigationButton = styled(BaseButton)`
  background-color: #ff9800;
  color: #ffffff;
`;

const App = () => {
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(null);

  const handleCalculation = () => {
    try {
      const calculation = result.replace(/×/g, '*').replace(/÷/g, '/');
      const finalResult = eval(calculation);
      if (isNaN(finalResult)) {
        setResult('Error');
      } else {
        setHistory([`${result} = ${finalResult}`, ...history].slice(0, 10));
        setResult(finalResult.toString());
        setCurrentHistoryIndex(null);
      }
    } catch (error) {
      setResult('Error');
    }
  };

  const handleButtonClick = (buttonValue) => {
    if (buttonValue === '=') {
      handleCalculation();
    } else if (buttonValue === 'C') {
      setResult('');
    } else {
      if (result === 'Error') {
        setResult(buttonValue);
      } else {
        setResult(result + buttonValue);
      }
    }
  };

  const navigateHistory = (isUp) => {
    if (isUp && currentHistoryIndex !== null && currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setResult(history[currentHistoryIndex - 1].split(' = ')[0]);
    } else if (!isUp && currentHistoryIndex !== null && currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setResult(history[currentHistoryIndex + 1].split(' = ')[0]);
    } else if (isUp && currentHistoryIndex === null && history.length > 0) {
      setCurrentHistoryIndex(0);
      setResult(history[0].split(' = ')[0]);
    } else if (!isUp && currentHistoryIndex === null && history.length > 0) {
      setCurrentHistoryIndex(history.length - 1);
      setResult(history[history.length - 1].split(' = ')[0]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key.match(/[0-9+\-*/.]/)) {
      if (result === 'Error') {
        setResult(event.key);
      } else {
        setResult((prevResult) => prevResult + event.key);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault(); // Prevent adding a newline character
      handleCalculation();
    } else if (event.key === 'Backspace') {
      setResult((prevResult) => prevResult.slice(0, -1));
    } else if (event.key === 'Escape') {
      setResult('');
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      navigateHistory(event.key === 'ArrowUp');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [result, history, currentHistoryIndex]);

  return (
    <PageContainer>
      <CalculatorContainer>
        <InputField type="text" value={result} readOnly />
        <HistoryDisplay>
          {history.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </HistoryDisplay>
        <KeyboardWrapper>
          <NumbersWrapper>
            <ButtonRow>
              <BaseButton onClick={() => handleButtonClick('7')}>7</BaseButton>
              <BaseButton onClick={() => handleButtonClick('8')}>8</BaseButton>
              <BaseButton onClick={() => handleButtonClick('9')}>9</BaseButton>
            </ButtonRow>
            <ButtonRow>
              <BaseButton onClick={() => handleButtonClick('4')}>4</BaseButton>
              <BaseButton onClick={() => handleButtonClick('5')}>5</BaseButton>
              <BaseButton onClick={() => handleButtonClick('6')}>6</BaseButton>
            </ButtonRow>
            <ButtonRow>
              <BaseButton onClick={() => handleButtonClick('1')}>1</BaseButton>
              <BaseButton onClick={() => handleButtonClick('2')}>2</BaseButton>
              <BaseButton onClick={() => handleButtonClick('3')}>3</BaseButton>
            </ButtonRow>
            <ButtonRow>
              <BaseButton onClick={() => handleButtonClick('0')}>0</BaseButton>
              <BaseButton onClick={() => handleButtonClick('(')}>(</BaseButton>
              <BaseButton onClick={() => handleButtonClick(')')}>)</BaseButton>
            </ButtonRow>
          </NumbersWrapper>
          <OperationsWrapper>
            <ButtonRow>
              <OperationButton onClick={() => handleButtonClick('×')}>×</OperationButton>
              <OperationButton onClick={() => handleButtonClick('÷')}>÷</OperationButton>
            </ButtonRow>
            <ButtonRow>
              <OperationButton onClick={() => handleButtonClick('-')}>-</OperationButton>
              <OperationButton onClick={() => handleButtonClick('+')}>+</OperationButton>
            </ButtonRow>
            <ButtonRow>
              <ClearButton onClick={() => handleButtonClick('C')}>C</ClearButton>
              <EqualsButton onClick={() => handleButtonClick('=')}>=</EqualsButton>
            </ButtonRow>
            <ButtonRow>
              <NavigationButton onClick={() => navigateHistory(true)}>↑</NavigationButton>
              <NavigationButton onClick={() => navigateHistory(false)}>↓</NavigationButton>
            </ButtonRow>
          </OperationsWrapper>
        </KeyboardWrapper>
      </CalculatorContainer>
    </PageContainer>
  );
};

export default App;
