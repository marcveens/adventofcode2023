import fs from 'fs';
import path from 'path';

const writtenNumbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
];

const readInput = (file: string) => {
  return fs.readFileSync(path.join(__dirname, file), {
    encoding: 'utf8'
  });
};

const getNumbersFromStr = (line: string) => {
  const numberValues: { value: string; index: number }[] = [];
  const numbers: string[] = [];
  
  // Find integers
  const chars = line.split('');
  for (const [index, char] of chars.entries()) {
    if (!Number.isNaN(parseInt(char))) {
      numberValues.push({ value: char, index });
    }
  }

  // Find numbers as text
  for (const [number, writtenNumber] of writtenNumbers.entries()) {
    const matches = [...line.matchAll(new RegExp(writtenNumber, 'g'))];
    matches.forEach(match => {
      if (match.index !== undefined) {
        numberValues.push({ value: number.toString(), index: match.index });
      }
    });
  } 

  // Sort numberValues
  const sortedNumberValues = numberValues.sort((a, b) => a.index - b.index);

  return sortedNumberValues.map(x => x.value);
};

(() => {
  const input = readInput('../day1-part1/input.txt');
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
