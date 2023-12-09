import fs from 'fs';
import path from 'path';

const readInput = (file: string) => {
  return fs.readFileSync(path.join(__dirname, file), {
    encoding: 'utf8'
  });
};

const getNumbersFromStr = (line: string) => {
  const numbers: string[] = [];
  const chars = line.split('');
  
  for (const char of chars) {
    if (!Number.isNaN(parseInt(char))) {
      numbers.push(char);
    }
  }

  return numbers;
};

(() => {
  const input = readInput('input.txt');
  const lines = input.split('\n');
  const allNumbers: number[] = [];

  for (const line of lines) {
    const numbers = getNumbersFromStr(line);

    if (numbers.length === 1) {
      allNumbers.push(parseInt(numbers[0] + numbers[0]));
    } else if (numbers.length > 1) {
      allNumbers.push(parseInt(numbers[0] + numbers[numbers.length - 1]));
    }
  }

  const total = allNumbers.reduce((prevValue, curValue) => {
    return prevValue + curValue;
  }, 0);

  console.log(total);
})();
