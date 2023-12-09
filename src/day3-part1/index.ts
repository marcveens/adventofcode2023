import fs from 'fs';
import path from 'path';

type Match = {
  value: string;
  startIndex: number;
  endIndex: number;
  shouldBeCounted: boolean;
};

const characterRegex = /[^.0-9]/;

const readInput = (file: string) => {
  return fs.readFileSync(path.join(__dirname, file), {
    encoding: 'utf8'
  });
};

const hasSiblingCharacter = (match: Match, line: string): boolean => {
  const previousCharacter = line[match.startIndex - 1];
  const nextCharacter = line[match.endIndex];

  return (!!previousCharacter && !!previousCharacter.match(characterRegex)) || (!!nextCharacter && !!nextCharacter.match(characterRegex));
};

const hasCharacterOnSiblingLine = (match: Match, line?: string): boolean => {
  if (!line) {
    return false;
  }

  const minIndex = Math.max(match.startIndex - 1, 0);
  const maxIndex = Math.min(match.endIndex + 1, line.length);
  const stringToCheck = line.slice(minIndex, maxIndex);

  return !!stringToCheck.match(characterRegex);
};

const getParticipatingNumbersPerLine = (line: string, prevLine?: string, nextLine?: string) => {
  const participatingNumbers: number[] = [];
  const decimalMatches = [...line.matchAll(/(\d+)/g)];

  decimalMatches.forEach((decimalMatch) => {
    const startIndex = decimalMatch.index || 0;
    const match: Match = {
      value: decimalMatch[0],
      startIndex: startIndex,
      endIndex: startIndex + decimalMatch[0].length,
      shouldBeCounted: false
    };

    const siblingCharacter = hasSiblingCharacter(match, line);
    const characterOnPrevLine = hasCharacterOnSiblingLine(match, prevLine);
    const characterOnNextLine = hasCharacterOnSiblingLine(match, nextLine);

    if (siblingCharacter || characterOnPrevLine || characterOnNextLine) {
      participatingNumbers.push(parseInt(match.value));
    }
  });

  return participatingNumbers;
};

const getParticipatingNumbers = (lines: string[]) => {
  const participatingNumbers: number[][] = [];

  lines.forEach((line, index) => {
    const participatingNumbersPerLine = getParticipatingNumbersPerLine(line, lines[index - 1], lines[index + 1]);

    participatingNumbers.push(participatingNumbersPerLine);
  });

  return participatingNumbers;
};

(() => {
  const input = readInput('input.txt');
  const participatingNumbers = getParticipatingNumbers(input.split('\n'));

  const total = participatingNumbers.reduce((prevValue, curValue) => {
    return prevValue + curValue.reduce((prevValue, curValue) => prevValue + curValue, 0);
  }, 0);

  console.log(total);
})();
