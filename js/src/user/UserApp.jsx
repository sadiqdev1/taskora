import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MemeDetail from './pages/MemeDetail';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Trending from './pages/Trending';
import UserSettings from './pages/Settings';
import Notifications from './pages/Notifications';
import Search from './pages/Search'; // ✅ add this

const UserApp = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="trending" element={<Trending />} />
        <Route path="p/:slug" element={<MemeDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload" element={<Upload />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  );
};

export default UserApp;