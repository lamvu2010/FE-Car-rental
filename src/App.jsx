import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import AdminPage from './pages/AdminPage'
import HangXe from './pages/HangXe';
import DongXe from './pages/Dongxe';
import Xe from './pages/Xe';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Dieukhoan from './pages/Dieukhoan';
import { UserProvider } from './ContextApi/UserContext';
import PrivateRoute from './components/PrivateRoute';
import Hopdong from './pages/Hopdong';
import AddCar from './pages/AddCar';
import TermDetail from './pages/TermDetail';
import TermVersions from './pages/TermVersions';
import UpdateCar from './pages/UpdateCar';
import Privacy from './pages/Privacy';
import InformationSecurity from './pages/InformationSecurity';
import UserInformation from './pages/UserInformation';
import WebSocket from './components/WebSocket';
import { MessageProvider } from './ContextApi/MessageContext';
import ContactDetail from './pages/ContactDetail';
import TermsAndConditions from './pages/TermsAndConditions';
import Payment from './pages/Payment';
import HopDongUser from './pages/HopDongUser';
import AddBienBanGiao from './pages/AddBienBanGiao';
import AddBienBanNhan from './pages/AddBienBanNhan';
import { ReturnRecordProvider } from './ContextApi/ReturnRecordContext';
import Bill from './pages/Bill';
import ThongBaoSuCo from './pages/ThongBaoSuCo';
import { SosanhProvider } from './ContextApi/SosanhContext';
import SsXe from './pages/SsXe';
import ContractPDF from './components/ContactPDF';
function App() {
    return (
        <Router>
            <UserProvider>
                <SosanhProvider>
                    <MessageProvider>
                        <ReturnRecordProvider>
                            <WebSocket />
                            <Routes>
                                <Route path="/home" exact element={<Homepage />} />
                                <Route path="/admin" exact element={
                                    <PrivateRoute requiredRole="admin">
                                        <AdminPage />
                                    </PrivateRoute>
                                } />
                                <Route path="/hangxe" exact element={
                                    <PrivateRoute requiredRole="admin">
                                        <HangXe />
                                    </PrivateRoute>} />
                                <Route path="/dongxe" exact element={
                                    <PrivateRoute requiredRole="admin">
                                        <DongXe />
                                    </PrivateRoute>} />
                                <Route path="/xe" exact element={
                                    <PrivateRoute requiredRole="admin">
                                        <Xe />
                                    </PrivateRoute>} />
                                <Route path="/signup" exact element={<Signup />} />
                                <Route path="/verify-otp" exact element={<VerifyOtp />} />
                                <Route path="/dieukhoan" exact element={
                                    <PrivateRoute requiredRole="admin">
                                        <Dieukhoan />
                                    </PrivateRoute>} />
                                <Route path="/dangky" exact element={<HopDongUser />} />
                                <Route path="/contacts" exact element={<Hopdong />} />
                                <Route path="/contact/:idhopdong" exact element={<ContactDetail />} />
                                <Route path="/addCar" element={<AddCar />} />
                                <Route path="/updateCar/:idxe" element={<UpdateCar />} />
                                <Route path="/term-details/:iddieukhoan" element={<TermDetail />} />
                                <Route path="/term-versions/:iddieukhoan" element={<TermVersions />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/personalinfo" element={<InformationSecurity />} />
                                <Route path="/userInfo" element={<UserInformation />} />
                                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                                <Route path="/payment" element={<Payment />} />
                                <Route path="/addDeliveryRecord/:idhopdong" element={<AddBienBanGiao />} />
                                <Route path="/addReturnRecord/:idhopdong" element={<AddBienBanNhan />} />
                                <Route path="/bill/:idhopdong" element={<Bill />} />
                                <Route path="/issue/:idthongbaosuco" element={<ThongBaoSuCo />} />
                                <Route path="/sosanh" element={<SsXe />} />
                                <Route path="/pdf" element={<ContractPDF />} />
                            </Routes>
                        </ReturnRecordProvider>
                    </MessageProvider>
                </SosanhProvider>
            </UserProvider>
        </Router>
    )
}

export default App