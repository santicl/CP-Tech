function selectUniqueGroups(groups, count, assignments, excludedGroups) {
    let selectedGroups = [];

    // Filtrar grupos excluidos
    let availableGroups = groups.filter(group => !excludedGroups.includes(group));

    // Calcular el número total de asignaciones por grupo
    let totalAssignmentsByGroup = {};
    assignments.forEach(assignment => {
        assignment.groups.forEach(group => {
            totalAssignmentsByGroup[group] = (totalAssignmentsByGroup[group] || 0) + 1;
        });
    });

    // Obtener el mínimo y el máximo de asignaciones entre todos los grupos
    let minAssignments = Math.min(...Object.values(totalAssignmentsByGroup));
    let maxAssignments = Math.max(...Object.values(totalAssignmentsByGroup));

    // Calcular las probabilidades ponderadas para cada grupo
    let weightedProbabilities = availableGroups.map(group => {
        let totalAssignments = totalAssignmentsByGroup[group] || 0;
        // Ajustar las probabilidades ponderadas en función del rango de asignaciones
        return 1 - (totalAssignments - minAssignments) / (maxAssignments - minAssignments + 1);
    });

    // Normalizar las probabilidades ponderadas para asegurar que sumen 1
    let totalWeight = weightedProbabilities.reduce((acc, val) => acc + val, 0);
    weightedProbabilities = weightedProbabilities.map(weight => weight / totalWeight);

    // Seleccionar grupos únicos basados en probabilidades ponderadas
    while (selectedGroups.length < count && availableGroups.length > 0) {
        let totalWeight = weightedProbabilities.reduce((acc, val) => acc + val, 0);
        let randomWeight = Math.random() * totalWeight;

        // Seleccionar un grupo basado en las probabilidades ponderadas
        let accumulatedWeight = 0;
        let selectedIndex = 0;
        for (let i = 0; i < weightedProbabilities.length; i++) {
            accumulatedWeight += weightedProbabilities[i];
            if (randomWeight <= accumulatedWeight) {
                selectedIndex = i;
                break;
            }
        }

        // Agregar el grupo seleccionado a la lista de grupos seleccionados
        let selectedGroup = availableGroups.splice(selectedIndex, 1)[0];
        selectedGroups.push(selectedGroup);

        // Actualizar las probabilidades ponderadas para reflejar la selección actual
        weightedProbabilities.splice(selectedIndex, 1);
        totalWeight -= randomWeight;
        weightedProbabilities = weightedProbabilities.map(weight => weight / totalWeight);
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
            wednesdayGroups = selectUniqueGroups(groups, 2, assignments, [...previousWednesdayGroups, ...previousSaturdayGroups]);
        } while (wednesdayGroups.length !== 2);

        // Asegurarse de que los grupos del sábado no se repitan con los del miércoles y la semana anterior
        do {
            saturdayGroups = selectUniqueGroups(groups, 2, assignments, [...wednesdayGroups, ...previousSaturdayGroups]);
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
