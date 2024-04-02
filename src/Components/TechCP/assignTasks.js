function selectUniqueGroups(groups, count, excludedGroups) {
    let selectedGroups = [];

    // Filtrar grupos excluidos
    let availableGroups = groups.filter(group => !excludedGroups.includes(group));

    // Seleccionar grupos únicos
    while (selectedGroups.length < count && availableGroups.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableGroups.length);
        let selectedGroup = availableGroups.splice(randomIndex, 1)[0];
        selectedGroups.push(selectedGroup);
    }

    return selectedGroups;
}

function assignTasks(addDays, startDate, weeks, groups) {
    let assignments = [];
    let previousWednesdayGroups = [];
    let previousSaturdayGroups = [];

    for (let i = 0; i < weeks; i++) {
        // Calcular las fechas para miércoles y sábado de esta semana
        let wednesday = addDays(startDate, i * 7 + 3); // Miércoles
        let saturday = addDays(startDate, i * 7 + 6); // Sábado

        // Seleccionar los grupos para los días de limpieza
        let wednesdayGroups = [];
        let saturdayGroups = [];

        // Asegurarse de que los grupos del miércoles no se repitan con la semana anterior
        do {
            wednesdayGroups = selectUniqueGroups(groups, 2, [...previousWednesdayGroups, ...previousSaturdayGroups]);
        } while (wednesdayGroups.length !== 2);

        // Asegurarse de que los grupos del sábado no se repitan con los del miércoles y la semana anterior
        do {
            saturdayGroups = selectUniqueGroups(groups, 2, [...wednesdayGroups, ...previousSaturdayGroups]);
        } while (saturdayGroups.length !== 2);

        // Agregar las asignaciones a la lista
        assignments.push({ date: wednesday, groups: wednesdayGroups });
        assignments.push({ date: saturday, groups: saturdayGroups });

        // Actualizar los grupos del miércoles y sábado de la semana anterior
        previousWednesdayGroups = wednesdayGroups.slice();
        previousSaturdayGroups = saturdayGroups.slice();
    }

    return assignments;
}



export default assignTasks;