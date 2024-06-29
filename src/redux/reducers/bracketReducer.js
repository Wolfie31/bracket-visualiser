import { createSlice } from '@reduxjs/toolkit';
import { generateMatches } from '../../utils/bracketGenerator';

const initialState = {
    teams: [],
    matches: [],
    numberOfTeams: 0,
};

const findNextMatch = (matches, currentMatch) => {
    const nextRound = currentMatch.roundNumber + 1;
    const nextMatchNumber = Math.floor((currentMatch.matchNumber + 1) / 2);
    return matches.find(match => match.roundNumber === nextRound && match.matchNumber === nextMatchNumber);
};

const updateNextMatch = (state, currentMatch, winner) => {
    const nextMatch = findNextMatch(state.matches, currentMatch);
    if (nextMatch) {
        if (currentMatch.matchNumber % 2 === 1) {
            nextMatch.team1 = winner;
        } else {
            nextMatch.team2 = winner;
        }
    }
}



export const bracketSlice = createSlice({
    name: 'bracket',
    initialState,
    reducers: {
        setTeams: (state, action) => {
            //action.payload is an array of teams
            state.teams = action.payload;
            state.numberOfTeams = action.payload.length;
            state.matches = generateMatches(action.payload)
        },
        updateMatch: (state, action) => {
            const {matchId, winner, score} = action.payload
            const matchIndex = state.matches.findIndex(match => match.id === matchId);
            if (matchIndex !== -1) {
                const currentMatch = state.matches[matchIndex];
                state.matches[matchIndex] = {
                    ...currentMatch,
                    winner,
                    score,
                };
                if (winner) {
                    const winningTeam = currentMatch.team1?.id === winner ? currentMatch.team1 : currentMatch.team2;
                    updateNextMatch(state, currentMatch, winningTeam);
                }


            }
        }
    }
});

export const { setTeams, setMatches, updateMatch } = bracketSlice.actions;

export default bracketSlice.reducer;
