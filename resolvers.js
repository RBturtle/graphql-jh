const fetch = require('node-fetch');

const API_URL = 'http://localhost:4000/v1';

const Query = {
    patient: async (parent, args, context, info) => {
        const { id } = args;
        const response = await fetch(`${API_URL}/patient/${id}`);
        const result = await response.json();
        return result;
    },

    doctor: async (parent, args, context, info) => {
        const { id } = args;
        const response = await fetch(`${API_URL}/doctor/${id}`);
        const result = await response.json();
        return result;
    },

};

const Patient = {
    async doctors(parent, args, context, info) {
        const { id } = parent;
        const url = `${API_URL}/visit/patient/${id}`;

        const visits = await fetch(url).then(response => response.json());

        /*
        const arrayOfDoctorPromises = visits.map((v) => {
            console.log(`Calling for doctor ${v.doctor_id}`);
            return fetch(`${API_URL}/doctor/${v.doctor_id}`).then((res) => res.json());
          });
        */

        const { loaders } = context;
        const arrayOfDoctorPromises = visits.map(v => loaders.doctorLoader.load(v.doctor_id));

        const doctors = await Promise.all(arrayOfDoctorPromises);
        return doctors;
    }
}

const Doctor = {
    async patients(parent, args, context, info) {
        const { id } = parent;
        const url = `${API_URL}/visit/doctor/${id}`;

        const visits = await fetch(url).then(response => response.json());

        const arrayOfDoctorPromises = visits.map(v => fetch(`${API_URL}/patient/${v.patient_id}`).then(res => res.json()));
        const patients = await Promise.all(arrayOfDoctorPromises);
        return patients;
    }
}

let mockAppointmentDB = [];

const Mutation = {
    createAppointment: (parent, args, context, info) => {
        const { input } = args;
        const { patient_id, doctor_id, date } = input;

        // Create a new Appointment Object
        const appointmentRecord = {
            id: mockAppointmentDB.length,
            patient_id,
            doctor_id,
            date,
        }

        // Save it to the DB
        mockAppointmentDB.push(appointmentRecord);

        // Return
        return {
            appointment: appointmentRecord,
        };
    }
}

module.exports = { Query, Patient, Doctor, Mutation };