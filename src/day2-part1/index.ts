import fs from 'fs';
import path from 'path';

type Set = {
  blue: number;
  red: number;
  green: number;
};

type Game = {
  index: number;
  sets: Set[];
};

const readInput = (file: string) => {
  return fs.readFileSync(path.join(__dirname, file), {
    encoding: 'utf8'
  });
};

const getNumberOfColors = (line: string, color: string): number => {
  const match = line.match(new RegExp(`(\\d+) ${color}`, 'g'));

  if (match && match.length > 0) {
    const parsedNumber = parseInt(match[0]);

    if (!Number.isNaN(parsedNumber)) {
      return parsedNumber;
    }
  }

  return 0;
};

const getSets = (gameLine: string): Set[] => {
  const sets: Set[] = [];
  const setsLine = gameLine.split(':')[1];
  const setsSplit = setsLine.split(';');

  for (const setLine of setsSplit) {
    const blues = getNumberOfColors(setLine, 'blue');
    const reds = getNumberOfColors(setLine, 'red');
    const greens = getNumberOfColors(setLine, 'green');

    sets.push({
      blue: blues,
      green: greens,
      red: reds
    });
  }

  return sets;
};

const getGames = (gameLines: string[]): Game[] => {
  const games: Game[] = [];

  for (const gameLine of gameLines) {
    const gameMatch = gameLine.match(/^Game (\d+):/);
    const game = gameMatch && gameMatch.length >= 1 ? gameMatch[1] : '0';
    const sets = getSets(gameLine);

    games.push({
      index: parseInt(game),
      sets
    });
  }

  return games;
};

(() => {
  const input = readInput('input.txt');
  const games = getGames(input.split('\n'));

  const bagItems = {
    red: 12,
    green: 13,
    blue: 14
  };

  const indexSum = games.reduce((prevValue, curValue) => {
    let isValidGame = true;

    curValue.sets.forEach((set) => {
      if (set.blue > bagItems.blue || set.green > bagItems.green || set.red > bagItems.red) {
        isValidGame = false;
      }
    });

    if (isValidGame) {
      return prevValue + curValue.index;
    }

    return prevValue;
  }, 0);

  console.log(indexSum);
})();
