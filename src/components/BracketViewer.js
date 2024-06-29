import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMatch } from '../redux/reducers/bracketReducer';
import BracketLines from './BracketLines';
import './BracketViewer.css';

const BracketViewer = () => {
    const matches = useSelector(state => state.bracket.matches);
    const dispatch = useDispatch();
    const [editingMatch, setEditingMatch] = useState(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);


    // group the matches by round
    // creates an dict-like object where each key is a round number, each value is an array of matches in that round
    const matchesByRound = matches.reduce((acc, match) =>{
        if (!acc[match.roundNumber]) {
            acc[match.roundNumber] = [];
        }
        acc[match.roundNumber].push(match);
        return acc;
    }, {});

    const handleMatchClick = (match) => {
        setEditingMatch(match.id);
    }

    const handleScoreSubmit = (matchId, team1Score, team2Score) => {
        const score = `${team1Score}-${team2Score}`;
        const winner = team1Score > team2Score ? matches.find(m => m.id === matchId).team1.id :
                    team2Score > team1Score ? matches.find(m => m.id === matchId).team2.id :
                    null;
        dispatch(updateMatch({ matchId, winner, score}));
        setEditingMatch(null);
    };

    const handleCancelButton = () => {
        setEditingMatch(null);
    };

    const renderTeam = (team, isWinner) => (
        <div className={`team ${isWinner ? 'winner' : ''}`}>
            <span className='seed'>{team?.seed || '-'}</span>
            <span className='name'>{team?.name || 'TBD'}</span>
        </div>

    )


    // returns a div with info regarding the match passed in args
    const renderMatch = (match) => {
        const team1IsWinner = match.winner === match.team1?.id;
        const team2IsWinner = match.winner === match.team2?.id;

        return (
        <div key={match.id} className="match" data-match-id={match.id} onClick={() => handleMatchClick(match)}>
            {renderTeam(match.team1, team1IsWinner)}
            {renderTeam(match.team2, team2IsWinner)}
            {match.score && <div className="score">{match.score}</div>}
            {editingMatch === match.id && (
                <MatchEditor 
                    match={match} 
                    onSubmit={handleScoreSubmit}
                    onCancel={handleCancelButton}
                />
            )}
        </div>
        );
    }

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.0005;
        const newScale = Math.min(Math.max(0.5, scale + delta), 2);
        setScale(newScale);
    }, [scale]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - startPosition.x;
        const newY = e.clientY - startPosition.y;
        setPosition({ x: newX, y: newY });
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.1, 2));
    }

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
    }

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    // returns a div containing the whole bracket. split into different rounds
    return (
        <div 
            className='bracket-container'
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div 
                className="bracket-viewer"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                }}
            >
                {Object.entries(matchesByRound).map(([roundNumber, roundMatches]) => (
                    <div key={roundNumber} className='round'>
                        <h3 className="round-title">Round {roundNumber}</h3>
                        <div className='matches-container'>{roundMatches.map(renderMatch)}</div>
                    </div>
                ))}
                <BracketLines matches={matches} />
            </div>
            <div className='zoom-controls'>
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
            </div>
        </div>
    );
};

const MatchEditor = ({ match, onSubmit, onCancel }) => {
    const [team1Score, setTeam1Score] = useState('');
    const [team2Score, setTeam2Score] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(match.id, team1Score === '' ? 0 : parseInt(team1Score), team2Score === '' ? 0 : parseInt(team2Score));
    };

    return (
        <form onSubmit={handleSubmit} className="match-editor">
            <input
                type="number"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                placeholder="0"
            />
            <input
                type="number"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                placeholder="0"
            />
            <button type="submit">Update</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default BracketViewer;