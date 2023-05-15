import React from "react"
import {Routes, Route, Navigate} from 'react-router-dom'
import {PatientPage} from './pages/Patient/PatientPage' 
import {AboutPage} from './pages/AboutPage' 
import {AdminPage} from './pages/Admin/AdminPage' 
import {DoctorPage} from './pages/Doctor/DoctorPage' 
import {UsersPage} from './pages/NoAuthorizeUser/UsersPage' 
import {RegistrationPage} from './pages/RegistrationPage'
import {LoginPage} from './pages/LoginPage'
import { OriginalQuestionnairePage } from "./pages/Admin/OriginalQuestionnairePage"
import { DictsPage } from "./pages/Admin/DictsPage"
import { DoctorsPage } from "./pages/Admin/DoctorsPage"
import { PatientsPage } from "./pages/Admin/PatientsPage"
import { ListAnketsPage } from "./pages/ListAnketsPage"
import { AnketaPatientPage } from "./pages/AnketaPatinetPage"
import { PatientsAdminPage } from "./pages/Admin/PatientsAdminPage"
import { StatisticsPage } from "./pages/Doctor/StatisticsPage"
import { PatientsDoctorPage } from "./pages/Doctor/PatientsDoctorPage"
import { RecomendationsPage } from "./pages/RecomendationsPage"
import { DirectionsPage } from "./pages/DirectionsPage"

export const useRoutes = (isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient, isRegistered) => {
    if (isAuthenticatedAdmin) {
        return (
            <Routes>
                <Route path="/" element={<AdminPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/original-questionnaire" element={<OriginalQuestionnairePage/>}/>
                <Route path="/dicts" element={<DictsPage/>}/>
                <Route path="/doctors" element={<DoctorsPage/>}/>
                <Route path="/patients/:id" element={<PatientsPage/>}/>
                <Route path="/patients/list_ankets/:id_patient" element={<ListAnketsPage/>}/>
                <Route path="/patients/list_ankets/:id_patient/:date_complete" element={<AnketaPatientPage/>}/>
                <Route path="/patients" element={<PatientsAdminPage/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }


    if (isAuthenticatedDoctor) {
        return (
            <Routes>
                <Route path="/" element={<DoctorPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/statistics" element={<StatisticsPage/>}/>
                <Route path="/patients" element={<PatientsDoctorPage/>}/>

                <Route path="/patients/list_ankets/:id_patient" element={<ListAnketsPage/>}/>
                <Route path="/patients/list_ankets/:id_patient/:date_complete" element={<AnketaPatientPage/>}/>

                <Route path="/patients/list_recomendations/:id_patient" element={<RecomendationsPage/>}/>

                <Route path="/patients/list_directions/:id_patient" element={<DirectionsPage/>}/>

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }

    if (isAuthenticatedPatient) {
        return (
            <Routes>
                <Route path="/" element={<PatientPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/recomendations/:id_patient" element={<RecomendationsPage/>}/>
                <Route path="/directions/:id_patient" element={<DirectionsPage/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }
    if (isRegistered) {
        return (
            <Routes>
                <Route path="/" element={<UsersPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }
    else {
        return (
            <Routes>
                <Route path="/" element={<UsersPage/>}/>
                <Route path="/registration" element={<RegistrationPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }
}