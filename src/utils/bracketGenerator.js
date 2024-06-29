const createMatch = (id, roundNumber, matchNumber) => ({
    id,
    roundNumber,
    matchNumber,
    team1: null,
    team2: null,
    winner: null,
    score: null,
});
export const generateMatches = (teams) => {
    const numTeams = teams.length;
    const numRounds = Math.log2(numTeams);
    const matches = [];
    const sortedTeams = [...teams].sort((a, b) => a.seed - b.seed);
    let matchId = 1;

    // Create matches for the first round with teams
    let round = 1;
    const midpoint = (numTeams /2) - 1
    for (let i = 0; i <= midpoint - 1; i= i+2){
        const team1Index = i;
        const team2Index = numTeams - 1 - i;

        const matchObj = createMatch(matchId, 1, matchId);
        matchObj.team1 = sortedTeams[team1Index];
        matchObj.team2 = sortedTeams[team2Index];

        matches.push(matchObj);
        matchId++;
    }
    const middleMatchObj = createMatch(matchId, 1, matchId)
    matchId++;
    middleMatchObj.team1 = sortedTeams[midpoint];
    middleMatchObj.team2 = sortedTeams[midpoint + 1];
    matches.push(middleMatchObj);

    for (let i = midpoint - 2; i >= 0; i= i-2){
        const team1Index = i;
        const team2Index = numTeams - 1 - i;

        const matchObj = createMatch(matchId, 1, matchId);
        matchObj.team1 = sortedTeams[team1Index];
        matchObj.team2 = sortedTeams[team2Index];

        matches.push(matchObj);
        matchId++;
    }


    // Create empty matches for subsequent rounds
    for (round = 2; round <= numRounds; round++) {
        const numMatches = numTeams / Math.pow(2, round);
        for (let i = 0; i < numMatches; i++) {
            const matchObj = createMatch(matchId, round, i + 1);
            matches.push(matchObj);
            matchId++;
        }
    }

    return matches;
};  


