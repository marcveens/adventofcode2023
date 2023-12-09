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

type GameWithColors = Game & Set;

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

const getMinimumColorsPerGame = (games: Game[]): GameWithColors[] => {
  const gamesWithMinimum: GameWithColors[] = [];

  games.forEach((game) => {
    const gameWithColors: GameWithColors = {
      ...game,
      blue: 0,
      green: 0,
      red: 0
    };

    game.sets.forEach(set => {
      if (set.blue > 0 && (set.blue > gameWithColors.blue || gameWithColors.blue === 0)) {
        gameWithColors.blue = set.blue;
      }

      if (set.red > 0 && (set.red > gameWithColors.red || gameWithColors.red === 0)) {
        gameWithColors.red = set.red;
      }

      if (set.green > 0 && (set.green > gameWithColors.green || gameWithColors.green === 0)) {
        gameWithColors.green = set.green;
      }
    });

    gamesWithMinimum.push(gameWithColors);
  });

  return gamesWithMinimum;
};

(() => {
  const input = readInput('input.txt');
  const games = getGames(input.split('\n'));

  const minimumColorsPerGame = getMinimumColorsPerGame(games);

  const sumOfPower = minimumColorsPerGame.reduce((prevValue, curValue) => {
    return prevValue + (curValue.blue * curValue.red * curValue.green);
  }, 0);

  console.log(sumOfPower);
})();
