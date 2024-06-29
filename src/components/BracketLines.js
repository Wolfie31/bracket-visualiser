import React, { useEffect, useRef } from 'react';

const BracketLines = ({ matches }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const matchElements = document.querySelectorAll('.match');

    // Clear existing lines
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    matchElements.forEach((matchElement) => {
      const matchId = parseInt(matchElement.dataset.matchId);
      const match = matches.find(m => m.id === matchId);

      if (match.roundNumber < Math.log2(matches.length)) {
        const nextRoundMatch = matches.find(m => 
          m.roundNumber === match.roundNumber + 1 && 
          Math.ceil(match.matchNumber / 2) === m.matchNumber
        );

        if (nextRoundMatch) {
          const nextMatchElement = document.querySelector(`[data-match-id="${nextRoundMatch.id}"]`);
          
          if (nextMatchElement) {
            const startRect = matchElement.getBoundingClientRect();
            const endRect = nextMatchElement.getBoundingClientRect();

            const startX = startRect.right - svg.getBoundingClientRect().left;
            const startY = startRect.top + startRect.height / 2 - svg.getBoundingClientRect().top;
            const endX = endRect.left - svg.getBoundingClientRect().left;
            const endY = endRect.top + endRect.height / 2 - svg.getBoundingClientRect().top;

            const midX = (startX + endX) / 2;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#95a5a6');
            path.setAttribute('stroke-width', '2');

            svg.appendChild(path);
          }
        }
      }
    });
  }, [matches]);

  return (
    <svg ref={svgRef} className="bracket-lines" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }} />
  );
};

export default BracketLines;