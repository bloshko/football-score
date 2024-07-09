import { Match, MatchID, FootballScore, TeamName } from "../lib";

const MOCK_DATE = "2024-02-01T12:00:00.000Z";

describe("FootballScore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start a match correctly", () => {
    const footballScore = new FootballScore();
    const matchId: MatchID = "123";
    const homeName: TeamName = "Team A";
    const awayName: TeamName = "Team B";

    footballScore.startMatch(homeName, awayName, matchId);

    expect(Object.keys(footballScore["liveMatches"])).toContain(matchId);
  });

  it("should throw error when starting a duplicate match", () => {
    const footballScore = new FootballScore();
    const matchId: MatchID = "123";
    const homeName: TeamName = "Team A";
    const awayName: TeamName = "Team B";

    footballScore.startMatch(homeName, awayName, matchId);

    expect(() =>
      footballScore.startMatch(homeName, awayName, matchId)
    ).toThrowError(`Live match with id: 123 already exists.`);
  });

  it("should remove a match correctly", () => {
    const footballScore = new FootballScore();
    const matchId: MatchID = "123";
    const homeName: TeamName = "Team A";
    const awayName: TeamName = "Team B";

    footballScore.startMatch(homeName, awayName, matchId);
    footballScore.removeMatch(matchId);

    expect(Object.keys(footballScore.liveMatches)).not.toContain(matchId);
  });

  it("should throw error when removing a non-existent match", () => {
    const footballScore = new FootballScore();
    const matchId: MatchID = "123";

    expect(() => footballScore.removeMatch(matchId)).toThrowError(
      `Live match with id: 123 does not exist.`
    );
  });

  it("should return sorted scoreboard", () => {
    const footballScore = new FootballScore();
    const matchId1: MatchID = "123";
    const matchId2: MatchID = "456";
    const matchId3: MatchID = "789";
    const homeName1: TeamName = "Team A";
    const awayName1: TeamName = "Team B";
    const homeName2: TeamName = "Team C";
    const awayName2: TeamName = "Team D";
    const homeName3: TeamName = "Team E";
    const awayName3: TeamName = "Team F";

    footballScore.startMatch(homeName1, awayName1, matchId1);
    footballScore.startMatch(homeName2, awayName2, matchId2);
    footballScore.startMatch(homeName3, awayName3, matchId3);

    const date = new Date(MOCK_DATE);
    vi.setSystemTime(date);

    const match1 = footballScore.liveMatches[matchId1];
    const match2 = footballScore.liveMatches[matchId2];
    const match3 = footballScore.liveMatches[matchId3];

    match1.updateScore(4, 0);

    date.setMinutes(date.getMinutes() + 1);
    vi.setSystemTime(date);

    match2.updateScore(0, 3);

    date.setMinutes(date.getMinutes() + 1);
    vi.setSystemTime(date);

    // match3 is updated later than match2 by using vi.setSystemTime(date)
    match3.updateScore(3, 0);

    const scoreboard = footballScore.scoreboard;

    expect(scoreboard[0].score.totalScore).toBe(4);
    expect(scoreboard[1].score.totalScore).toBe(3);
    expect(scoreboard[1].id).toBe("789");
    expect(scoreboard[2].score.totalScore).toBe(3);
    expect(scoreboard[2].id).toBe("456");
  });
});

describe("Match", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a match correctly", () => {
    const matchId: MatchID = "123";
    const homeName: TeamName = "Team A";
    const awayName: TeamName = "Team B";

    const date = new Date(MOCK_DATE);
    vi.setSystemTime(date);

    const match = new Match(homeName, awayName, matchId);

    expect(match).toEqual({
      _homeName: "Team A",
      _awayName: "Team B",
      _id: "123",
      _homeScore: 0,
      _awayScore: 0,
      _totalScore: 0,
      _createdDate: new Date(MOCK_DATE),
      _lastUpdatedDate: new Date(MOCK_DATE),
    });
  });

  it("should update score and total correctly", () => {
    const matchId: MatchID = "123";
    const homeName: TeamName = "Team A";
    const awayName: TeamName = "Team B";

    const creationDate = new Date(MOCK_DATE);
    vi.setSystemTime(creationDate);

    const match = new Match(homeName, awayName, matchId);

    const updateDate = new Date(MOCK_DATE);
    updateDate.setMinutes(updateDate.getMinutes() + 1);

    vi.setSystemTime(updateDate);
    match.updateScore(1, 0);

    expect(match).toEqual({
      _homeName: "Team A",
      _awayName: "Team B",
      _id: "123",
      _homeScore: 1,
      _awayScore: 0,
      _totalScore: 1,
      _createdDate: creationDate,
      _lastUpdatedDate: updateDate,
    });

    const newUpdateDate = new Date(MOCK_DATE);
    newUpdateDate.setMinutes(newUpdateDate.getMinutes() + 2);

    vi.setSystemTime(newUpdateDate);
    match.updateScore(1, 1);

    expect(match).toEqual({
      _homeName: "Team A",
      _awayName: "Team B",
      _id: "123",
      _homeScore: 1,
      _awayScore: 1,
      _totalScore: 2,
      _createdDate: creationDate,
      _lastUpdatedDate: newUpdateDate,
    });
  });
});
