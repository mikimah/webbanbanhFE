import {Plus, Edit, Trash2} from 'lucide-react'
import { useEffect, useState } from 'react';
import api from '../api/api';
import { showError, showSuccess } from '../utils/notify';


function SmD13(){
    const [search,setSearch]=useState('');
    const [add,setAdd]=useState(false);
    const [update,setUpdate]=useState(false);
    const [del,setDel]=useState(null);
    const [code,setCode]=useState('');
    const [type,setType]=useState('percent');
    const [value,setValue]=useState('');
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [minOrder,setMinOrder]=useState('');
    const [maxOrder,setMaxOrder]=useState('');
    const [id,setId]=useState(null);
    const [items,setItems]=useState([]);


    // ✅ Hàm lấy ngày hôm nay dạng YYYY-MM-DD
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ✅ Hàm lấy ngày hôm sau dạng YYYY-MM-DD
    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ✅ Convert YYYY-MM-DD sang DD-MM-YY
    function formatDateToDMY(dateString) {
        if(!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Lấy 2 chữ số cuối
        return `${day}-${month}-${year}`;
    }

    // ✅ Convert DD-MM-YY sang YYYY-MM-DD
    function formatDateToYMD(dateString) {
        if(!dateString) return '';
        const parts = dateString.split('-');
        if(parts.length === 3) {
            let year = parts[2];
            // Nếu là 2 chữ số, convert thành 4 chữ số
            if(year.length === 2) {
                year = Number(year) > 30 ? '19' + year : '20' + year;
            }
            return `${year}-${parts[1]}-${parts[0]}`;
        }
        return dateString;
    }

    // ✅ Logic kiểm tra minOrder và maxOrder đúng
    function validateMinMaxOrder() {
        // Nếu cả hai đều empty hoặc 0 thì không kiểm tra
        if ((minOrder === '' || minOrder === 0) && (maxOrder === '' || maxOrder === 0)) {
            return true;
        }

        // Kiểm tra minOrder
        if (minOrder !== '' && minOrder !== 0) {
            if (Number(minOrder) < 0) {
                showError("Giá trị tối thiểu không được nhỏ hơn 0");
                return false;
            }
        }

        // Kiểm tra maxOrder
        if (maxOrder !== '' && maxOrder !== 0) {
            if (Number(maxOrder) < 0) {
                showError("Giá trị tối đa không được nhỏ hơn 0");
                return false;
            }
        }

        // Nếu cả hai có giá trị thì kiểm tra mối quan hệ
        if ((minOrder !== '' && minOrder !== 0) && (maxOrder !== '' && maxOrder !== 0)) {
            const min = Number(minOrder);
            const max = Number(maxOrder);

            if (min > max) {
                showError("Giá trị tối thiểu không được lớn hơn giá trị tối đa");
                return false;
            }

            if (min === max) {
                showError("Giá trị tối thiểu không được bằng giá trị tối đa");
                return false;
            }
        }

        return true;
    }

    async function handleAdd(e){
        e.preventDefault();

        // ✅ Kiểm tra input cơ bản
        if (!code.trim()) {
            showError("Vui lòng nhập mã khuyến mãi");
            return;
        }

        if (!value) {
            showError("Vui lòng nhập giá trị");
            return;
        }

        if(type === 'percent' && (Number(value) <= 0 || Number(value) > 100)){
            showError("Giá trị phần trăm phải từ 1 đến 100");
            return;
        }

        if(type === 'vnd' && Number(value) <= 0){
            showError("Giá trị VNĐ phải lớn hơn 0");
            return;
        }

        if (!startDate || !endDate) {
            showError("Vui lòng chọn ngày bắt đầu và kết thúc");
            return;
        }

        if(startDate > endDate) {
            showError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
        }

        // ✅ Kiểm tra minOrder và maxOrder
        if (!validateMinMaxOrder()) {
            return;
        }

        try {
            const response = await api.post("/coupon", {
                TenKM: code,
                LoaiKM: type,
                GiaTri: value,
                NgayBD: formatDateToDMY(startDate),
                NgayKT: formatDateToDMY(endDate),
                ToiThieu: minOrder || 0,
                ToiDa: maxOrder || 0
            });

            if(response.data.status == 200){
                showSuccess(response.data.message);
                getAllItems();
                setAdd(false);
                resetVal();
            }
        } catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi thêm khuyến mãi");
        }

        
    }

    async function handleUpdate(e){
        e.preventDefault();

        if (!code.trim()) {
            showError("Vui lòng nhập mã khuyến mãi");
            return;
        }

        if (!value) {
            showError("Vui lòng nhập giá trị");
            return;
        }

        if(type === 'percent' && (Number(value) <= 0 || Number(value) > 100)){
            showError("Giá trị phần trăm phải từ 1 đến 100");
            return;
        }

        if(type === 'vnd' && Number(value) <= 0){
            showError("Giá trị VNĐ phải lớn hơn 0");
            return;
        }

        if (!startDate || !endDate) {
            showError("Vui lòng chọn ngày bắt đầu và kết thúc");
            return;
        }

        if(startDate > endDate) {
            showError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
        }

        if (!validateMinMaxOrder()) {
            return;
        }

        try {
            const response = await api.post(`/coupon/${id}`, {
                TenKM: code,
                LoaiKM: type,
                GiaTri: value,
                NgayBD: formatDateToDMY(startDate),
                NgayKT: formatDateToDMY(endDate),
                ToiThieu: minOrder || 0,
                ToiDa: maxOrder || 0
            });

            if(response.data.status == 200){
                showSuccess(response.data.message);
                getAllItems();
                setUpdate(false);
                resetVal();
            }
        } catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi cập nhật khuyến mãi");
        }
    }

    async function handleDelete(idx){
        if(confirm("Bạn có chắc muốn xóa khuyến mãi này?")){
            try {
                const response = await api.delete(`/coupon/${idx}`);
                if(response.data.status == 200){
                    showSuccess(response.data.message);
                    getAllItems();
                    setDel(null);
                }
            } catch(e){
                console.log(e);
                showError("Có lỗi xảy ra khi xóa khuyến mãi");
            }
        }
    }

    async function getAllItems() {
        try {
            const response = await api.get("/coupon");
            if(response.data.status == 200){
                setItems(response.data.items);
            }
        } catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi tải khuyến mãi");
        }
    }

    function resetVal(){
        setCode('');
        setType('percent');
        setValue('');
        setStartDate('');
        setEndDate('');
        setMinOrder('');
        setMaxOrder('');
        setId(null);
    }

    function handleSetUpdate(item){
        setId(item.MaKM || item.id);
        setCode(item.TenKM || item.code);
        setType(item.LoaiKM || item.type);
        setValue(item.GiaTri || item.value);
        // ✅ Convert từ d-m-y sang Y-m-d
        setStartDate(formatDateToYMD(item.NgayBD || item.start_date));
        setEndDate(formatDateToYMD(item.NgayKT || item.end_date));
        setMinOrder(item.ToiThieu || item.min_order || '');
        setMaxOrder(item.ToiDa || item.max_order || '');
        setUpdate(true);
    }

    async function handleSearch(e){
        e.preventDefault();
        if(search.trim() === ""){
            getAllItems();
            return;
        }
        
        try {
            const response = await api.get(`/coupon/search/${search}`);
            if(response.data.status == 200){
                setItems(response.data.items);
            }
        } catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi tìm kiếm");
        }
    }

    useEffect(() => {
        getAllItems();
    }, []);

    return(<div className="w-full h-full">
        <div className='flex items-center justify-between p-9'>
            <span className='text-3xl font-bold text-gray-700'>Quản lý khuyến mãi</span>
            <button 
            type='button'
            onClick={() => {
                setAdd(true);
                resetVal();
                setStartDate(getTodayDate());
                setEndDate(getTomorrowDate());
            }}
            className='flex items-center rounded-[5px] text-white text-xl bg-amber-400 hover:bg-amber-500 p-2 duration-200 hover:cursor-pointer'>
                <Plus size={30}/>
                Thêm khuyến mãi
            </button>
        </div>
        
        <form className='w-[95%] m-auto ' onSubmit={handleSearch}>
            <input type="search"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
            placeholder='Tìm kiếm khuyến mãi...'
            className='border-gray-300 border w-full p-2 rounded-[5px] '
            />
        </form>

        <div className='w-[95%] h-[72%] m-auto mt-5 overflow-y-auto'>
            <table className='table-auto w-full'>
                <thead className='sticky top-0'>
                    <tr className='bg-gray-200 text-md text-gray-500 grid grid-cols-6'>
                    <th className='col-span-1 p-2'>KHUYẾN MÃI</th>
                    <th className='col-span-1 p-2'>LOẠI</th>
                    <th className='col-span-1 p-2'>GIÁ TRỊ</th>
                    <th className='col-span-1 p-2'>THỜI HẠN</th>
                    <th className='col-span-1 p-2'>ĐIỀU KIỆN</th>
                    <th className='col-span-1 p-2'>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-300'>
                    {items && items.length > 0 ? items.map((item, index) => (
                        <tr key={index} className='bg-gray-100 grid grid-cols-6 py-3 divide-x-2 divide-gray-300'>
                            <td className='col-span-1 p-2 flex items-center justify-center font-semibold'>{item.TenKM}</td>
                            <td className='col-span-1 p-2 flex items-center justify-center'>{item.LoaiKM === 'percent' ? '%' : 'VNĐ'}</td>
                            <td className='col-span-1 p-2 flex items-center justify-center font-bold text-amber-600'>{item.GiaTri}</td>
                            <td className='col-span-1 p-2 flex items-center text-center justify-center text-sm'>{formatDateToDMY(item.NgayBD)} <br /> ~ <br /> {formatDateToDMY(item.NgayKT)}</td>
                            <td className='col-span-1 p-2 flex items-center justify-center text-sm'>{item.ToiThieu ? item.ToiThieu : 0} (tối thiểu để dùng) <br /> {item.ToiDa ? item.ToiDa : 0} (giảm giá tối đa)</td>
                            <td className='col-span-1 p-2 flex items-center justify-center gap-2'>
                                <button 
                                type='button'
                                onClick={() => handleSetUpdate(item)}
                                className='bg-blue-500 text-white p-2 rounded-[5px] hover:bg-blue-600 duration-200 flex items-center gap-1'>
                                    <Edit size={16}/>
                                    Sửa
                                </button>
                                <button 
                                type='button'
                                onClick={() => handleDelete(item.MaKM || item.id)}
                                className='bg-red-500 text-white p-2 rounded-[5px] hover:bg-red-600 duration-200 flex items-center gap-1'>
                                    <Trash2 size={16}/>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className='p-3 text-center text-gray-500'>
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* ✅ Form thêm khuyến mãi */}
        {add && (
            <div className='fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50'>
                <div className='bg-white w-[90%] max-w-[600px] rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto'>
                    
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-gray-800'>Thêm khuyến mãi</h2>
                        <button
                        type='button'
                        onClick={() => {setAdd(false); resetVal();}}
                        className='text-gray-400 hover:text-gray-600 text-3xl font-bold'
                        >×</button>
                    </div>

                    <form onSubmit={handleAdd} className='flex flex-col gap-4'>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Mã khuyến mãi</label>
                            <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder='VD: SUMMER20'
                            className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Loại</label>
                                <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                >
                                    <option value="percent">Phần trăm (%)</option>
                                    <option value="vnd">VNĐ</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Giá trị</label>
                                <input 
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder='0'
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Ngày bắt đầu</label>
                                <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Ngày kết thúc</label>
                                <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tối thiểu</label>
                                <input 
                                type="number"
                                value={minOrder}
                                onChange={(e) => setMinOrder(e.target.value)}
                                placeholder='0'
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tối đa</label>
                                <input 
                                type="number"
                                value={maxOrder}
                                onChange={(e) => setMaxOrder(e.target.value)}
                                placeholder='0'
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button 
                            type='submit'
                            className='flex-1 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 rounded-[5px] duration-200'
                            >
                                Thêm
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        )}

        {/* ✅ Form sửa khuyến mãi */}
        {update && (
            <div className='fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50'>
                <div className='bg-white w-[90%] max-w-[600px] rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto'>
                    
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-gray-800'>Sửa khuyến mãi</h2>
                        <button
                        type='button'
                        onClick={() => {setUpdate(false); resetVal();}}
                        className='text-gray-400 hover:text-gray-600 text-3xl font-bold'
                        >×</button>
                    </div>

                    <form onSubmit={handleUpdate} className='flex flex-col gap-4'>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Mã khuyến mãi</label>
                            <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Loại</label>
                                <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                >
                                    <option value="percent">Phần trăm (%)</option>
                                    <option value="vnd">VNĐ</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Giá trị</label>
                                <input 
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Ngày bắt đầu</label>
                                <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Ngày kết thúc</label>
                                <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tối thiểu</label>
                                <input 
                                type="number"
                                value={minOrder}
                                onChange={(e) => setMinOrder(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tối đa</label>
                                <input 
                                type="number"
                                value={maxOrder}
                                onChange={(e) => setMaxOrder(e.target.value)}
                                className='w-full border border-gray-300 p-2 rounded-[5px] focus:outline-none focus:border-amber-400'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button 
                            type='submit'
                            className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-[5px] duration-200'
                            >
                                Cập nhật
                            </button>
                            <button 
                            type='button'
                            onClick={() => {setUpdate(false); resetVal();}}
                            className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-[5px] duration-200'
                            >
                                Hủy
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        )}

    </div>);
}

export default SmD13;