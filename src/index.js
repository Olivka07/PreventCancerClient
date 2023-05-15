import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthState } from './context/auth.context';
import { QuestionsState } from './context/questions.context';
import {PatientState} from './context/patient.context'
// import {QuestionsDataState} from './context/questions.data.context'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthState>
    {/* <QuestionsDataState> */}
      <QuestionsState>
        <PatientState>
          <App />
        </PatientState>
      </QuestionsState>
    {/* </QuestionsDataState> */}
  </AuthState>
)


