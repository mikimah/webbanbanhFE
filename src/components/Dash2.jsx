import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import api from '../api/api';
import { showError } from '../utils/notify';

function Dash2() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    async function fetchUsers() {
        setIsLoadingUsers(true);
        try {
            const response = await api.get('/users');
            const userList = Array.isArray(response.data?.data) ? response.data.data : [];
            setUsers(userList.filter((user) => String(user.VaiTro || '').toLowerCase() !== 'admin'));
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Có lỗi xảy ra');
        } finally {
            setIsLoadingUsers(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    const filteredUsers = users.filter((user) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return true;
        }

        return [user.TenDangNhap, user.HoTen, user.Email, user.DiaChi, user.SoDienThoai].some((value) =>
            String(value || '')
                .toLowerCase()
                .includes(keyword)
        );
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="w-full h-full flex items-center bg-gray-100 font-inter">
            <div className="m-auto w-[95%] h-[95%] rounded-[5px] shadow-2xl bg-white">
                <div className="flex items-center justify-between p-9">
                    <span className="text-3xl font-bold">Quản lý người dùng</span>
                </div>

                <form className="w-[95%] m-auto" onSubmit={handleSubmit}>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="border-gray-300 border w-full p-2 rounded-[5px]"
                    />
                </form>

                <div className="w-[95%] h-[75%] m-auto mt-5">
                    <table className="table-auto w-full bg-red-400">
                        <thead>
                            <tr className="bg-gray-200 text-md text-gray-500 grid grid-cols-6">
                                <th className="col-span-1 p-2">NGƯỜI DÙNG</th>
                                <th className="col-span-1 p-2">HỌ VÀ TÊN</th>
                                <th className="col-span-1 p-2">EMAIL</th>
                                <th className="col-span-1 p-2">ĐỊA CHỈ</th>
                                <th className="col-span-1 p-2">SĐT</th>
                                <th className="col-span-1 p-2">THAO TÁC</th>
                            </tr>
                        </thead>
                    </table>

                    <div className="h-[400px] w-full overflow-y-scroll">
                        {isLoadingUsers ? (
                            <div className="flex h-full items-center justify-center bg-gray-100">
                                <ClipLoader loading={true} size={36} color="#f59e0b" />
                            </div>
                        ) : (
                            <table className="table-auto w-full">
                                <tbody className="divide-y-2 divide-gray-300">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user.MaND}
                                                className="bg-gray-100 font-bold grid grid-cols-6 divide-x-2 divide-gray-300"
                                            >
                                                <td className="col-span-1 p-2 flex items-center justify-center">
                                                    {user.TenDangNhap || 'N/A'}
                                                </td>
                                                <td className="col-span-1 p-2 flex items-center justify-center">
                                                    {user.HoTen || 'N/A'}
                                                </td>
                                                <td className="col-span-1 p-2 flex items-center justify-center">
                                                    {user.Email || 'N/A'}
                                                </td>
                                                <td className="col-span-1 p-2 flex items-center justify-center">
                                                    {user.DiaChi || 'N/A'}
                                                </td>
                                                <td className="col-span-1 p-2 flex items-center justify-center">
                                                    {user.SoDienThoai || 'N/A'}
                                                </td>
                                                <td className="col-span-1 p-2 flex items-center justify-center">-</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="grid grid-cols-6 bg-gray-100 font-bold">
                                            <td className="col-span-6 p-4 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dash2;
