import { Player } from './types';

export const oppositePlayer = (player: Player) => (
  player === 'player1' ? 'player2' : 'player1'
);

const formattedSecsOrMins = (time: number) => {
  return (time <= 9) ? '0' + String(time) : String(time);
}

export const formattedTime = (time: number): string => {
  const totalSeconds = Math.ceil(time/1000);
  const hours = Math.floor(totalSeconds/3600);
  const hoursInSeconds = hours * 3600;
  const minutes = Math.floor((totalSeconds - hoursInSeconds)/60);
  const minutesInSeconds = minutes * 60;
  const seconds = (totalSeconds - hoursInSeconds - minutesInSeconds) % 60;

  if (totalSeconds <= 59) {
    return '0:' + formattedSecsOrMins(totalSeconds);
  } else if (totalSeconds < 3600) {
    return String(minutes) + ':' + formattedSecsOrMins(seconds);
  } else {
    return String(hours) + ':' + formattedSecsOrMins(minutes) + ':' + formattedSecsOrMins(seconds);
  }
}
