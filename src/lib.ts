export type MatchID = string;
export type TeamName = string;
export type Score = number;

/**
 * Represents a football score management system.
 */
export class FootballScore {
  private _liveMatches: Record<MatchID, Match> = {};

  /**
   * Starts a new football match.
   * @param {TeamName} homeName - The name of the home team.
   * @param {TeamName} awayName - The name of the away team.
   * @param {MatchID} matchId - The unique identifier for the match.
   * @returns {Match} The created match object.
   * @throws {Error} If a live match with the same ID already exists.
   */
  startMatch(homeName: TeamName, awayName: TeamName, matchId: MatchID) {
    if (this._liveMatches?.[matchId] !== undefined) {
      throw Error(`Live match with id: ${matchId} already exists.`);
    }

    const newMatch = new Match(homeName, awayName, matchId);
    this._liveMatches[matchId] = newMatch;

    return newMatch;
  }

  /**
   * Removes a match from the live matches.
   * @param {MatchID} matchIdToRemove - The ID of the match to remove.
   * @throws {Error} If no live match exists with the given ID.
   */
  removeMatch(matchIdToRemove: MatchID) {
    if (this._liveMatches?.[matchIdToRemove] === undefined) {
      throw Error(`Live match with id: ${matchIdToRemove} does not exist.`);
    }

    delete this._liveMatches[matchIdToRemove];
  }

  /**
   * Retrieves the array of live matches sorted by score and update time.
   * @type {Match[]}
   * @readonly
   */
  get liveMatches() {
    return this._liveMatches;
  }

  /**
   * Retrieves the scoreboard sorted by total score and update time.
   * @type {Match[]}
   * @readonly
   */
  get scoreboard() {
    return [...Object.values(this._liveMatches)].sort((matchA, matchB) => {
      if (matchA.score.totalScore === matchB.score.totalScore) {
        return (
          matchB.lastUpdatedDate.getTime() - matchA.lastUpdatedDate.getTime()
        );
      }

      return matchB.score.totalScore - matchA.score.totalScore;
    });
  }
}

/**
 * Represents a football match.
 */
export class Match {
  private _createdDate: Date;
  private _lastUpdatedDate: Date;

  private _homeName: TeamName;
  private _awayName: TeamName;
  private _id: MatchID;

  private _homeScore: Score = 0;
  private _awayScore: Score = 0;

  private _totalScore: Score = 0;

  /**
   * Constructs a new football match.
   * @param {TeamName} homeName - The name of the home team.
   * @param {TeamName} awayName - The name of the away team.
   * @param {MatchID} id - The unique identifier for the match.
   */
  constructor(homeName: TeamName, awayName: TeamName, id: MatchID) {
    this._homeName = homeName;
    this._awayName = awayName;
    this._id = id;
    this._createdDate = new Date();
    this._lastUpdatedDate = this._createdDate;
  }

  /**
   * Retrieves the current score of the match.
   * @type {{ homeScore: Score, awayScore: Score, totalScore: Score }}
   * @readonly
   */
  get score() {
    return {
      homeScore: this._homeScore,
      awayScore: this._awayScore,
      totalScore: this._totalScore,
    };
  }

  /**
   * Retrieves the date when the match was created.
   * @type {Date}
   * @readonly
   */
  get createdDate() {
    return this._createdDate;
  }

  /**
   * Retrieves the date when the match was last updated.
   * @type {Date}
   * @readonly
   */
  get lastUpdatedDate() {
    return this._lastUpdatedDate;
  }

  /**
   * Retrieves the name of the home team.
   * @type {TeamName}
   * @readonly
   */
  get homeName() {
    return this._homeName;
  }

  /**
   * Retrieves the name of the away team.
   * @type {TeamName}
   * @readonly
   */
  get awayName() {
    return this._awayName;
  }

  /**
   * Retrieves the current score of the home team.
   * @type {Score}
   * @readonly
   */
  get homeScore() {
    return this._homeScore;
  }

  /**
   * Retrieves the current score of the away team.
   * @type {Score}
   * @readonly
   */
  get awayScore() {
    return this._awayScore;
  }

  /**
   * Retrieves the unique identifier for the match.
   * @type {MatchID}
   * @readonly
   */
  get id() {
    return this._id;
  }

  /**
   * Updates the scores of the home and away teams.
   * @param {Score} newHomeScore - The new score for the home team.
   * @param {Score} newAwayScore - The new score for the away team.
   */
  updateScore(newHomeScore: Score, newAwayScore: Score) {
    this._homeScore = newHomeScore;
    this._awayScore = newAwayScore;

    this._totalScore = newHomeScore + newAwayScore;
    this._lastUpdatedDate = new Date();
  }
}
