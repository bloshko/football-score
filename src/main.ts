import { FootballScore, Match } from "./lib";

const main = () => {
  const footballScore = new FootballScore();

  footballScore.startMatch("Mexico", "Canada", "1").updateScore(0, 5);
  footballScore.startMatch("Spain", "Brazil", "2").updateScore(10, 2);
  footballScore.startMatch("Germany", "France", "3").updateScore(2, 2);
  footballScore.startMatch("Uruguay", "Italy", "4").updateScore(6, 6);
  footballScore.startMatch("Argentina", "Australia", "5").updateScore(3, 1);

  printScoreboard(footballScore.scoreboard);
};

const printScoreboard = (scoreboard: Match[]) => {
  console.log("Scoreboard:\n");

  for (const match of scoreboard) {
    console.log(
      `${match.homeName} ${match.homeScore} - ${match.awayName} ${match.awayScore}`
    );
  }
};

main();
