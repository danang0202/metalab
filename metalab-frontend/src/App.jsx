//eslint-disable-next-line
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './assets/components/Login';
import Beranda from './assets/components/talent/Beranda';
import Register from './assets/components/Register';
import Layout from './assets/components/talent/Layout';
import HiringLayout from './assets/components/talent/hiring/HiringLayout';
import LayoutAdmin from './assets/components/admin/LayoutAdmin';
import LayoutAdminTalent from './assets/components/admin/adminTalent/LayoutAdminTalent';
import TalentDetail from './assets/components/admin/adminTalent/TalentDetail';
import HiringDetailLayout from './assets/components/talent/hiring/HiringDetailLayout';
import FormApply from './assets/components/talent/hiring/formApplyComponent/FormApply';
import VerificationEmail from './assets/components/VerificationEmail';
import FormInputJob from './assets/components/admin/adminJob/FormInputJob';
import Jobs from './assets/components/talent/job/Jobs';
import Jobdetail from './assets/components/talent/job/Jobdetail';
import FirstStage from './assets/components/talent/hiring/hiringStageComponent/FirstStage';
import FilePage from './assets/components/FilePage';
import AdminHiringTabel from './assets/components/admin/adminHiring/AdminHiringTabel';
import AdminStage from './assets/components/admin/adminHiring/AdminStage';
import SecondStage from './assets/components/talent/hiring/hiringStageComponent/SecondStage';
import ThirdStage from './assets/components/talent/hiring/hiringStageComponent/ThirdStage';
import FourthStage from './assets/components/talent/hiring/hiringStageComponent/FourthStage';
import LayoutAdminClient from './assets/components/admin/adminClient/LayoutAdminClient';
import FormInputClient from './assets/components/admin/adminClient/FormInputClient';
import ClientDetail from './assets/components/admin/adminClient/ClientDetail';
import LayoutAdminJob from './assets/components/admin/adminJob/LayoutAdminJob';
import AdminJobDetail from './assets/components/admin/adminJob/AdminJobDetail';
import FormEditClient from './assets/components/admin/adminClient/FormEditClient';
import FormEditJob from './assets/components/admin/adminJob/FormEditJob';
import { useEffect } from 'react';
import api from './assets/apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { getCurrentDate, shouldUpdate } from './assets/main';
import LayoutAdminCalender from './assets/components/admin/adminCalender/LayoutAdminCalender';
import Logout from './assets/components/talent/Logout';
import ResetPasswordForm from './assets/components/ResetPasswordForm';
import ProfilePage from './assets/components/talent/profile/Profile';
import FileChat from './assets/components/admin/adminChat/FileChat';
import TalentChat from './assets/components/talent/chat/TalentChat';
import AdminChatLayout from './assets/components/admin/adminChat/adminChatLayout';


function App() {

  useEffect(() => {
    const update = async () => {
      try {
        await api.get('/update-hiring-status-by-date', {
        });
      } catch (error) {
        console.error('Error:', error);
      }

      try {
        await api.get('/update-job-status-by-date', {
        });
      } catch (error) {
        console.error('Error:', error);
      }
      Cookies.set('crone-job', getCurrentDate(), { expires: 1 });
    };


    if (shouldUpdate()) {
      update();
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/file/:filename/:extension' element={<FilePage />} />
          <Route path='/fileChat/:filename/:extension' element={<FileChat />} />
          <Route path="/logout" element={<Logout />} />
          <Route path='/reset-password/:email/:token' element={<ResetPasswordForm />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Jobs />} />
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/hiring" element={<HiringLayout />} />
            <Route path="/hiring/detail/:idHiring" element={<HiringDetailLayout />} />
            <Route path="/jobs/detail/:idJob" element={<Jobdetail />} />
            <Route path="/job/:jobId/hiring/form-apply" element={<FormApply />} />
            <Route path="/hiring/detail/:hiringId/:jobId/first-stage/:id" element={<FirstStage />} />
            <Route path="/hiring/detail/:hiringId/:jobId/second-stage/:id" element={<SecondStage />} />
            <Route path="/hiring/detail/:hiringId/:jobId/third-stage/:id" element={<ThirdStage />} />
            <Route path="/hiring/detail/:hiringId/:jobId/fourth-stage/:id" element={<FourthStage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* <Route path="chat" element={<TalentChat />} /> */}
          </Route>
          <Route path='/admin' element={<LayoutAdmin />}>
            {/* <Route index /> */}
            <Route path="talent" element={<LayoutAdminTalent />} />
            <Route path="talent/detail/:idTalent" element={<TalentDetail />} />
            <Route path="client" element={<LayoutAdminClient />} />
            <Route path="client/detail/:id" element={<ClientDetail />} />
            <Route path="client/input-form" element={<FormInputClient />} />
            <Route path="client/edit/:id" element={<FormEditClient />} />
            <Route path="job" element={<LayoutAdminJob />} />
            <Route path="job/input-form" element={<FormInputJob />} />
            <Route path="job/detail/:idJob" element={<AdminJobDetail />} />
            <Route path="job/edit/:idJob" element={<FormEditJob />} />
            <Route path="hiring" element={<AdminHiringTabel />} />
            <Route path="hiring/detail/:idHiring" element={<AdminStage />} />
            <Route path="calender" element={<LayoutAdminCalender />} />
            <Route path="chat" element={<AdminChatLayout />} />
          </Route>
          <Route path='/email-verification/:id' element={<VerificationEmail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
