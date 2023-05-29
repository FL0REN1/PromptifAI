import { Route, Routes, useLocation } from 'react-router-dom';
import MainWindow from './components/mainWindow';
import MyCabinetWindow from './components/myCabinetWindow';
import LogInWindow from './components/LogInWindow';
import SignUpWindow from './components/SignUpWindow';
import ResetWindow from './components/ResetWindow';
import { AnimatePresence } from 'framer-motion';
import UserChatWindow from './components/UserChatWindow';
import SignUpSupportWindow from './components/SignUpSupportWindow';
import SupportChatWindow from './components/SupportChatWindow';
import ErrorWindow from './components/assistance/ErrorWindow';

export default function Navigation() {
  const location = useLocation();
  return (
    <div>
      <AnimatePresence mode='wait'>
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<LogInWindow />} />
          <Route path="/signUp" element={<SignUpWindow />} />
          <Route path="/main/:id" element={<MainWindow />} />
          <Route path="/reset/:id/:token" element={<ResetWindow />} />
          <Route path='/chat/user/:id/:token' element={<UserChatWindow />} />
          <Route path='/signUp/support' element={<SignUpSupportWindow />} />
          <Route path='/chat/support/:id/:token' element={<SupportChatWindow />} />
          <Route path="/cabinet/:id" element={<MyCabinetWindow />} />
          <Route path="*" element={<ErrorWindow />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}