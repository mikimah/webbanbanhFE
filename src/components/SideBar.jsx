import {Package,User,Database,LogOut} from 'lucide-react'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { showError, showSuccess } from '../utils/notify';
import { useNavigate } from 'react-router';

function SideBar({handleSetPage,page}) {
    const [num,setNum]=useState(page);
    const {user,clearAuthState} = useAuth();
    const navigate = useNavigate();
    
    function handleSetNum(x){
      setNum(x);
      handleSetPage(x);
    }

    async function handleLogout() {
        try{
            const response = await api.post('logout');
            if(response.data.status==200){
                showSuccess(response.data.message);
                clearAuthState();
                navigate('/');
            }
        }catch(e){
            showError(e.response.data.message); 
        }
    }

    return (
        <div className="bg-white w-full h-full flex flex-col items-center justify-between font-inter shadow-2xl ">
            <div className='w-full flex flex-col items-center'>
                {/* Logo Section */}
                <div className="flex items-center my-5">
                    <div  className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-amber-300 to-orange-400 p-2 rounded-full">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C9.243 2 7 4.243 7 7v1H6c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v1H9V7c0-1.654 1.346-3 3-3zm6 6v10H6V10h12z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-amber-800">Amai Delight</h1>
                            <p className="text-xs text-amber-500 -mt-1">Premium Bakery</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className=" w-full flex flex-col p-1 pt-4 font-bold text-xl gap-1 text-gray-700 border-t border-gray-200">
                    <button onClick={()=>handleSetNum(1)} className={`${num == 1?'bg-gray-200 text-amber-500':null} py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-gray-100 flex items-center gap-6 duration-75`}>
                        <Package  size={30} />
                        Nội dung
                    </button>
                    <button  onClick={()=>handleSetNum(2)}  className={`${num == 2?'bg-gray-200 text-amber-500':null} py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-gray-100 flex items-center gap-6 duration-75`}>
                        <User size={30}/>
                        Người dùng
                    </button>
                    <a  onClick={()=>handleSetNum(3)}  className={`${num == 3?'bg-gray-200 text-amber-500':null} py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-gray-100 flex items-center gap-6 duration-75`}>
                        <Database size={30}/>
                        Thống kê
                    </a>
                </div>
            </div>

            <div className='w-full h-auto p-4 border-t border-gray-200'>
                <div className='flex items-center gap-4 mb-4 justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='rounded-full w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center'>
                            <span className='text-white font-bold text-lg'>{user?.name?.charAt(0) || 'A'}</span>
                        </div>
                        <div>
                            <p className='font-bold text-gray-800'>{user?.name || 'Admin'}</p>
                            <p className='text-[10px] text-gray-500'>Quản trị viên</p>
                        </div>
                    </div>
                    
                    {/* ✅ Icon logout */}
                    <button 
                        onClick={handleLogout}
                        title="Đăng xuất"
                        className='p-2 rounded-lg hover:bg-red-100 hover:cursor-pointer transition duration-200'
                    >
                        <LogOut size={24} className='text-red-500 hover:text-red-600' />
                    </button>
                </div>
            </div>

        </div>
    );
}

export default SideBar;