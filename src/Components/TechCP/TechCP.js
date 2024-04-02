import React, { useEffect, useState, useMemo } from 'react';
import { addDays, format, endOfYear, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale en español
import assignTasks from './assignTasks';
import '../../Components/TechCP/techcp.style.css';

function GroupRepetitionCounter({ groupCounts }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Resumen de Asignaciones</h3>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', border: '1px solid #ddd', fontFamily: 'Arial, sans-serif' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Grupo</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Cantidad de Asignaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupCounts).map(([group, count]) => (
                        <tr key={group}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{group}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TechCP() {
    const groups = useMemo(() => ['Salon Del Reino 1', 'Salon Del Reino 2', 'Torices', 'Papayal', 'Paseo Bolivar', 'Lo Amador', 'Nariño', 'G Posada 1', 'G Posada 2'], []);

    const [assignments, setAssignments] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const countGroupRepetitions = (assignments) => {
        const groupCounts = assignments.reduce((accumulator, assignment) => {
            assignment.groups.forEach(group => {
                accumulator[group] = (accumulator[group] || 0) + 1;
            });
            return accumulator;
        }, {});

        return groupCounts;
    };

    const handleReloadClick = () => {
        const startDate = startOfWeek(new Date());
        const endDate = endOfYear(new Date());
        const weeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        const assignmentsData = assignTasks(addDays, startDate, weeks, groups);
        setAssignments(assignmentsData);
        setShowTable(true);
    };

    return (
        <div style={{ maxWidth: '100%', overflowX: 'auto', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', marginTop: '50px' }}>Programa de Limpieza Tech</h1>
            <p style={{ textAlign: 'center', fontSize: '15px', marginBottom: '20px' }}>Este programa está diseñado para asignar grupos de limpieza durante el año disponible.</p>
            {!showTable ? (
                <button onClick={handleReloadClick} className="reload-button">Obtener programación</button>
            ) : (
                <>
                    <GroupRepetitionCounter groupCounts={countGroupRepetitions(assignments)} />
                    <button onClick={handleReloadClick} style={{ width: '250px', marginBottom: '10px' }} className="reload-button">Obtener de nuevo</button>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontFamily: 'Arial, sans-serif' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Fecha</th>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Día</th>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Grupos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.date}>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{format(assignment.date, 'dd/MM/yyyy')}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{format(assignment.date, 'EEEE', { locale: es })}</td> {/* Obtener el nombre del día en español */}
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{assignment.groups.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default TechCP;
