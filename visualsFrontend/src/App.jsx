import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Portfolio from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contacts from './pages/Contacts'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import MyProfile from './pages/MyProfile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NewLogin from './pages/NewLogin'
import FinishLogin from './pages/FinishLogin'
import Notification from './components/Notification'
import NotificationProvider from './context/NotificationContext'
import ClientDashboard from './pages/ClientDashboard'
import ClientProjectDetail from './pages/ClientProjectDetail'
import ClientReelDetail from './pages/ClientReelDetail'
import { mockClientData, mockProjects, mockBillingData } from './data/mockClientData'

const App = () => {
  const location = useLocation()
  const [clientData, setClientData] = useState(null)
  const [isLoadingClient, setIsLoadingClient] = useState(true)
  
  // Check for existing client session
  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    const savedData = localStorage.getItem('clientData')
    
    if (token && savedData) {
      try {
        setClientData(JSON.parse(savedData))
      } catch (err) {
        console.error('Error loading client data:', err)
        localStorage.removeItem('clientToken')
        localStorage.removeItem('clientData')
      }
    }
    
    setIsLoadingClient(false)
  }, [])
  
  const handleClientLogin = (data) => {
    setClientData(data)
  }
  
  const handleClientLogout = () => {
    setClientData(null)
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientData')
  }
  
  const isLoginPage = location.pathname === '/login' || location.pathname === '/newlogin' || location.pathname === '/finish-login'
  const isClientPage = location.pathname.startsWith('/client')
  const isHomePage = location.pathname === '/'
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const loginPaths = ['/login', '/newlogin', '/finish-login']
    if (!loginPaths.includes(location.pathname)) {
      const pathWithSearch = `${location.pathname}${location.search || ''}`
      localStorage.setItem('lastVisitedPath', pathWithSearch)
    }
  }, [location.pathname, location.search])
  
  return (
    <NotificationProvider>
      <div
        style={{
          paddingTop: isLoginPage ? '0px' : '67px',
          background: isHomePage && !isLoginPage
            ? 'linear-gradient(#000 0, #000 80px, transparent 80px)'
            : 'transparent'
        }}
      >
        <Notification />
        {!isLoginPage && !isClientPage && <Navbar />}
        <Routes>
          {/* Main Website Routes */}
          <Route path='/' element={<Portfolio/>} ></Route>
          <Route path='/collection' element={<Collection/>} ></Route>
          <Route path='/about' element={<About/>} ></Route>
          <Route path='/contact' element={<Contacts/>} ></Route>
          <Route path='/product/:productId' element={<Product/>} ></Route>
          <Route path='/cart' element={<Cart/>} ></Route>
          <Route path='/login' element={<Login/>} ></Route>
          <Route path='/newlogin' element={<NewLogin/>} ></Route>
          <Route path='/finish-login' element={<FinishLogin />} />
          <Route path='/place-order' element={<PlaceOrder/>} ></Route>
          <Route path='/orders' element={<Orders/>} ></Route>
          <Route path='/profile' element={<MyProfile/>} ></Route>
          <Route path='/privacy' element={<PrivacyPolicy/>} ></Route>
          <Route path='/terms' element={<TermsConditions/>} ></Route>
          
          {/* Client Portal Routes */}
          <Route
            path='/client/login'
            element={<Navigate to='/login?mode=client' replace />}
          />
          <Route
            path='/client/dashboard'
            element={
              clientData ? (
                <ClientDashboard
                  clientData={clientData}
                  projects={[]}
                  billingData={mockBillingData}
                  onLogout={handleClientLogout}
                />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          <Route
            path='/client/project/:projectId'
            element={
              clientData ? (
                <ClientProjectDetail 
                  clientData={clientData} 
                  projects={mockProjects}
                  onLogout={handleClientLogout} 
                />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          <Route
            path='/client/reel/:projectId/:reelNumber'
            element={
              clientData ? (
                <ClientReelDetail />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
        </Routes>
        {!isLoginPage && !isClientPage && <Footer />}
      </div>
    </NotificationProvider>
  )
}

export default App
