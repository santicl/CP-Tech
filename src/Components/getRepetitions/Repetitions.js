import React from 'react';

function GroupRepetitionCounter({ assignments }) {
    const countGroupRepetitions = () => {
        const groupCounts = assignments.reduce((accumulator, assignment) => {
            assignment.groups.forEach(group => {
                accumulator[group] = (accumulator[group] || 0) + 1;
            });
            return accumulator;
        }, {});

        return groupCounts;
    };

    const groupCounts = countGroupRepetitions();

    console.log('--- Group Repetition Counter ---');
    console.log(groupCounts);
    console.log('--------------------------------');

    return null; // Este componente no renderiza nada en la interfaz
}

export default GroupRepetitionCounter;
