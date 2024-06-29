import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTeams } from '../redux/reducers/bracketReducer';
import './BracketCreator.css';

const BracketCreator = () => {
    const [numTeams, setNumTeams] = useState(0);
    const [teamInputs, setTeamInputs] = useState([]);
    const dispatch = useDispatch();

    const handleNumTeamsChange = (e) => {
        // sets num to a converted value (probably str to int) of e(event) value.
        // e is refering to an event, e.g textbox update. 10 is declaring it is base 10 (decimal)
        const num = parseInt(e.target.value, 10);
        // updates number of teams
        setNumTeams(num);
        // updates the teamInputs with an array filled of empty team names and seeds up to num
        setTeamInputs(Array(num).fill({name: ' ', seed: ' ' }));
    };

    const handleTeamInputChange = (index, field, value) => {
        //Copies existing teamInputs array into local newTeamInputs
        const newTeamInputs = [...teamInputs];
        // Sets the field to value at newTeamInputs[index]
        // ... means keep everything else the same
        newTeamInputs[index] = {...newTeamInputs[index], [field]: value };
        // sets the teamInputs to the modified newTeamInputs
        setTeamInputs(newTeamInputs);
    }


    const handleSubmit = (e) => {
        // prevents default values from being submitted
        e.preventDefault();
        // teamInputs.map goes over each item in the teamInputs array
        // the teams variable will be an array
        // each element in teams will have an id, name and seed
        
        const teams = teamInputs.map((team, index) => ({
            id: index+1,
            name: team.name || `Team ${index+1}`,
            // seed will attempt to parseInt team.seed, otherwise will make it equal to index+1
            seed: parseInt(team.seed, 10) || index+1
        }));
        // dispatch is a call to "dispatch" an item to the store, it's from the useDispatch() redux function
        dispatch(setTeams(teams));
    };

    return (
        <div className="bracket-creator">
            <h2>Create Tournament Bracket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='numTeams'>Number of Teams:</label>
                    <select
                        id="numTeams"
                        value={numTeams}
                        onChange={handleNumTeamsChange}
                    >
                        <option value="0">Select one</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                    </select>
                </div>
                <div className="team-input-container">
                    {teamInputs.map((team, index) => (
                        <div key={index} className="team-input">
                            <input
                                type="text"
                                placeholder={`Team ${index + 1} Name`}
                                value={team.name}
                                onChange={(e) => handleTeamInputChange(index, 'name', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder={'Seed'}
                                value={team.seed}
                                onChange={(e) => handleTeamInputChange(index, 'seed', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button type="submit">Create Bracket</button>
            </form>
        </div>
    );
};

export default BracketCreator;