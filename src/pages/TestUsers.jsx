import api from '../api/api';
import { useState,useEffect } from 'react';

function TestUsers() {
    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return(
        <div className='w-[95%] m-auto mt-5'>
 

            <div className='border border-gray-300 rounded-lg overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-gray-200 text-gray-700'>
                            <th className='p-3 text-left'>ID</th>
                            <th className='p-3 text-left'>Tên</th>
                            <th className='p-3 text-left'>Email</th>
                            <th className='p-3 text-left'>Số điện thoại</th>
                            <th className='p-3 text-left'>Địa chỉ</th>
                            <th className='p-3 text-left'>Vai trò</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-300'>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.MaND} className='bg-white hover:bg-gray-50'>
                                    <td className='p-3 text-gray-800'>{user.MaND}</td>
                                    <td className='p-3 text-gray-800'>{user.HoTen}</td>
                                    <td className='p-3 text-gray-800'>{user.Email}</td>
                                    <td className='p-3 text-gray-800'>{user.SoDienThoai === null ? 'N/A' : user.SoDienThoai}</td>
                                    <td className='p-3 text-gray-800'>{user.DiaChi === null ? 'N/A' : user.DiaChi}</td>
                                    <td className='p-3 text-gray-800'>{user.VaiTro}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='p-3 text-center text-gray-500'>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TestUsers;