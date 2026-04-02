
import { Routes, Route } from 'react-router'
import ScrollToTop from './utils/ScrollToTop.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DashBoard from './pages/DashBoard.jsx'
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Product from './pages/Product.jsx'
import Product2 from './pages/Product2.jsx'
import Product3 from './pages/Product3.jsx'
import Product4 from './pages/Product4.jsx'
import Cart from './pages/Cart.jsx'
import Contact from './pages/Contact.jsx'
import CheckOut from './pages/CheckOut.jsx'
import SearchBar from './components/SearchBar.jsx'
import TestUsers from './pages/TestUsers.jsx'
import {useSearch} from './context/SearchContext.jsx'; 

function App() {
  const { isLoading } = useSearch();
  return (
    <>
        <ScrollToTop />
        {/* Search Bar */}
          <div className={`fixed bg-black/50 w-screen h-screen z-20  left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 ${isLoading ? 'block' : 'hidden'}`}>
            <SearchBar />
          </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<TestUsers />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/search" element={<Product4  />} />
          <Route path="/product/:id" element={<Product2 />} />
          <Route path="/category/:id" element={<Product3 />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/login" target="_blank" element={<Login />} />
          <Route path="/register" target="_blank" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        </Routes>
          
    </>
  )
}

export default App
