export interface Medication {
    id: string;
    name: string;
    dosage: string;
    time: string;
    status: 'Scheduled' | 'Taken' | 'Upcoming';
}

const medications: Medication[] = [
    { id: '1', name: 'Losartan', dosage: '50mg', time: '8:00 AM', status: 'Taken' },
    { id: '2', name: 'Metformin', dosage: '500mg', time: '12:00 PM', status: 'Upcoming' },
    { id: '3', name: 'Losartan', dosage: '50mg', time: '8:00 PM', status: 'Scheduled' },
];

export const getMedications = () => {
    return medications;
};

export const addMedication = (med: Omit<Medication, 'id' | 'status'>) => {
    const newMed: Medication = {
        id: Math.random().toString(36).substr(2, 9),
        name: med.name,
        dosage: med.dosage,
        time: med.time,
        status: 'Scheduled', // Default status
    };
    medications.push(newMed);
    return newMed;
};
