import { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import api from '../api/api';
import { showError,showSuccess } from '../utils/notify';
import { ClipLoader } from 'react-spinners';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError({});
    try{
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      console.log(response.data);
      if(response.data.status==200){
        showSuccess(response.data.message);
        navigate('/login');
      }else{
        showError("Có lỗi xảy ra");
      }
    }catch(e){
      console.log(e);
      if(e.response?.data){
        setError(e.response.data.errors);
        if(errors.length > 0)
        showError(e.response.data.message);  
      }else{
        showError("Có lỗi xảy ra");
      }
      
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='flex min-h-[100vh] flex-col justify-center'>

      <div className="flex-1 bg-gradient-to-br from-amber-50/50 to-orange-50/50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">

            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <a href="/" className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-amber-300 to-orange-400 p-2 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C9.243 2 7 4.243 7 7v1H6c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v1H9V7c0-1.654 1.346-3 3-3zm6 6v10H6V10h12z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-amber-900 mb-2">Đăng ký</h1>
            <p className="text-center text-amber-600 mb-6">Tạo tài khoản mới của bạn</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={` ${error.name && 'border-red-500'} w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
                  placeholder="Họ tên của bạn"
                />
                {error.name && <p className="text-red-500 text-sm mt-1">{error.name[0]}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${error.email&&'border-red-500'} w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {error.email && <p className="text-red-500 text-sm mt-1">{error.email[0]}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${error.password&& 'border-red-500'} w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
                  placeholder="••••••••"
                />
                {error.password && <p className="text-red-500 text-sm mt-1">{error.password[0]}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${error.password&& 'border-red-500'} w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>


              {!loading ? 
              <button
                type="submit"
                className="w-full bg-gradient-to-r hover:cursor-pointer from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
              >
                Đăng ký
              </button>
              :
               <button
                type="submit"
                className="w-full bg-gradient-to-r hover:cursor-pointer from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
              >
                < ClipLoader loading={true} size={14} color="#ffffff" />
              </button>
              }

            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="text-amber-600 hover:text-amber-700 font-semibold transition"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  )
}
