import React, { useEffect, useState, useMemo } from 'react';
import { addDays, format, endOfYear, startOfWeek } from 'date-fns';
import assignTasks from './assignTasks';
import '../../Components/TechCP/techcp.style.css';

function TechCP() {
    // Definir los grupos
    const groups = useMemo(() => ['Salon Del Reino 1', 'Salon Del Reino 2', 'Torices', 'Papayal', 'Paseo Bolivar', 'Lo Amador', 'Nariño', 'G Posada 1', 'G Posada 2'], []);

    const [assignments, setAssignments] = useState([]);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        let startDate = startOfWeek(new Date());
        let endDate = endOfYear(new Date());
        let weeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        const assignmentsData = assignTasks(addDays, startDate, weeks, groups);
        setAssignments(assignmentsData);
    }, [groups]); // Agrega groups como dependencia

    function getDay(date) {
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return weekdays[date.getDay()];
    }

    const handleReloadClick = () => {
        // Generar nuevas asignaciones al hacer clic en el botón
        let startDate = startOfWeek(new Date());
        let endDate = endOfYear(new Date());
        let weeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        const assignmentsData = assignTasks(addDays, startDate, weeks, groups);
        setAssignments(assignmentsData);
        setShowTable(true);
    };

    return (
        <div style={{ maxWidth: '100%', overflowX: 'auto', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', marginTop: '50px' }}>Tech Cleaner Program</h1>
            <p style={{ textAlign: 'center', fontSize: '15px', marginBottom: '20px' }}>Este programa está desarrollado para asignar grupos de aseo durante el año disponible</p>
            {showTable ? (
                <>
                    <button onClick={handleReloadClick} style={ { width: '250px' } } className="reload-button">Obtener de nuevo</button>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontFamily: 'Arial, sans-serif', marginBottom: '20px' }}>
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
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{getDay(assignment.date)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{assignment.groups.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <button onClick={handleReloadClick} className="reload-button">Obtener programación</button>
            )}
        </div>
    );
}

export default TechCP;
