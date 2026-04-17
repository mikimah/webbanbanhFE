import { useState,useEffect } from 'react';
import api from '../api/api';
import { showError,showSuccess } from '../utils/notify';
import {Info} from 'lucide-react'
function Dash3(){
    const [startDate, setStartDate] = useState('');
    const [data,setData]= useState({
        items: [],
        order_today: 0,
        order_month: 0,
        order_year: 0,
        order_sum: 0
    });
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState(null);

    function validateDates() {
        setError('');
        
        if(startDate === '' || endDate === '') {
            return true;
        }

        if(new Date(startDate) > new Date(endDate)) {
            setError(true);
            return false;
        }

        return true;
    }

    async function handleSubmit(e){
        e.preventDefault();
        
        if(!validateDates()) {
            return;
        }
        console.log("Ngày bắt đầu:", startDate);
        console.log("Ngày kết thúc:", endDate);
        try{
            const response = await api.get(`/order/search`, {
                params: {
                    startDate,
                    endDate
                }
            });
            
            if(response.data.status === 200){
                setData(response.data);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra lấy dữ liệu");
        }
    }

    async function getAllItems() {
        try {
            const response = await api.get('/order');
            if(response.data.status === 200){
                console.log(response.data);
                setData(response.data);
            }
        } catch (error) {
            console.error(error);
            showError("Có lỗi xảy ra khi lấy dữ liệu");
        }
    }

    useEffect(() => {
        getAllItems();
    }, []);

    return(<div className="w-full h-full flex items-center bg-gray-100 font-inter">
        
        <div className="m-auto w-[95%] h-[95%] rounded-[5px] shadow-2xl bg-white">
            <div className='flex items-center justify-between p-9'>
                <span className='text-3xl font-bold text-gray-700'>Thống kê dữ liệu</span>
                
                <form onSubmit={handleSubmit} className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                        <label className='text-sm font-semibold'>Từ ngày:</label>
                        <input 
                        onChange={(e)=>{
                            setStartDate(e.target.value);
                            setError(false);
                        }} 
                        type="date" 
                        value={startDate}
                        className={`hover:cursor-pointer border p-2 rounded-[5px] focus:outline-none focus:border-amber-400 transition ${
                            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}/>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='text-sm font-semibold'>Đến ngày:</label>
                        <input 
                        onChange={(e)=>{
                            setEndDate(e.target.value);
                            setError(false);
                        }} 
                        type="date" 
                        value={endDate}
                        className={`border p-2 rounded-[5px] focus:outline-none focus:border-amber-400 transition ${
                            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}/>
                    </div>

                    <button type='submit' className='hover:cursor-pointer bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-[5px] p-2 duration-200'>Lọc</button>
                    
                    {/* ✅ Nút xóa */}
                    <button 
                    type='button'
                    onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setError(false);
                        getAllItems();
                    }}
                    className='bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold rounded-[5px] p-2 duration-200'
                    >
                        Xóa
                    </button>
                </form>
            </div>

            <div className='flex m-auto w-[95%] h-[20%] justify-around'>
                <div className='w-[15%] h-full rounded-[5px] text-md text-center p-2 bg-gray-200'>
                    Tổng đơn hàng
                    <div className='text-7xl mt-2'>{data.order_sum}</div>
                </div>
                <div className='w-[15%] h-full rounded-[5px] text-md text-center p-2 bg-gray-200'>Đơn hàng hôm nay
                    <div className='text-7xl mt-2'>{data.order_today}</div>
                </div>
                <div className='w-[15%] h-full rounded-[5px] text-md text-center p-2 bg-gray-200'>Đơn hàng tháng này
                    <div className='text-7xl mt-2'>{data.order_month}</div>
                </div>
                <div className='w-[15%] h-full rounded-[5px] text-md text-center p-2 bg-gray-200'>Đơn hàng năm này
                    <div className='text-7xl mt-2'>{data.order_year}</div>
                </div>
            </div>
            

            <div className=' w-[95%] h-[60%] m-auto mt-5 '>
                <table className='table-auto w-full bg-red-400 '>
                    <thead>
                        <tr className='bg-gray-200 text-md text-gray-500 grid grid-cols-4'>
                        <th className='col-span-1 p-2'>MÃ ĐƠN HÀNG</th>
                        <th className='col-span-1 p-2'>NGÀY ĐẶT</th>
                        <th className='col-span-1 p-2'>TRẠNG THÁI</th>
                        <th className='col-span-1 p-2'>THAO TÁC</th>
                        </tr>
                    </thead>
                </table>
                    <div className="w-full h-[360px] overflow-y-scroll">
                        <table className="table-auto w-full">
                            <tbody className="divide-y-2 divide-gray-300">
                                {data.items.map((item,index) => (
                                    <tr
                                        className="bg-gray-100 font-bold grid grid-cols-4 py-3 h-auto divide-x-2 divide-gray-300"
                                        key={index}
                                    >
                                    <td className="col-span-1 p-2 flex items-center justify-center">
                                    {item.MaDH}
                                    </td>
                                    <td className="col-span-1 p-2 flex items-center justify-center">
                                    {item.NgayDat}
                                    </td>
                                    <td className="col-span-1 p-2 flex items-center justify-center">
                                    {item.TrangThai}
                                    </td>
                                    <td className="col-span-1 p-2 flex items-center justify-center">
                                     <button
                                        className="bg-blue-500 rounded-[5px]  text-white p-2 flex items-center justify-center gap-2 duration-75 hover:scale-[1.1] hover:cursor-pointer"
                                        onClick={()=>{setInfo(item);}}
                                    >
                                        Xem <Info size={20} />
                                    </button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                
            </div>


        {info && <div className='flex items-center justify-center w-full h-full bg-black/30 fixed top-0 left-0 right-0 bottom-0 z-50'>
    <div className='bg-white w-[90%] max-w-[700px] rounded-lg shadow-2xl py-8 px-6 flex flex-col gap-6 max-h-[95vh] overflow-y-auto'>
        
        <div className='flex items-center justify-between mb-2'>
            <h2 className='text-3xl font-bold text-gray-800'>Chi tiết đơn hàng</h2>
            <button
            type='button'
            className='text-gray-400 hover:text-gray-600 text-4xl font-bold hover:cursor-pointer'
            onClick={()=>{setInfo(null)}}
            >×</button>
        </div>

        {/* Thông tin đơn hàng */}
        <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg'>
            <div>
                <p className='text-sm text-gray-500 font-semibold'>Mã đơn hàng</p>
                <p className='text-lg font-bold text-gray-800'>{info?.MaDH}</p>
            </div>
            <div>
                <p className='text-sm text-gray-500 font-semibold'>Ngày đặt</p>
                <p className='text-lg font-bold text-gray-800'>{info?.NgayDat}</p>
            </div>
            <div>
                <p className='text-sm text-gray-500 font-semibold'>Số điện thoại</p>
                <p className='text-lg font-bold text-gray-800'>{info?.SoLienHe}</p>
            </div>
            <div>
                <p className='text-sm text-gray-500 font-semibold'>Trạng thái</p>
                <p className='text-lg font-bold text-gray-800'>{info?.TrangThai}</p>
            </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-500 font-semibold mb-2'>Địa chỉ giao hàng</p>
            <p className='text-base text-gray-800'>{info?.DiaChiGiao}</p>
        </div>

        {/* Table sản phẩm */}
        <div>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>Sản phẩm trong đơn hàng</h3>
            <div className='border border-gray-300 rounded-lg overflow-hidden'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-gray-200 text-gray-700'>
                            <th className='p-3 text-left'>Tên sản phẩm</th>
                            <th className='p-3 text-center'>Số lượng</th>
                            <th className='p-3 text-right'>Giá</th>
                            <th className='p-3 text-right'>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-300'>
                        {info?.chi_tiet_don_hang && info.chi_tiet_don_hang.map((product, index) => (
                            <tr key={index} className='bg-white hover:bg-gray-50'>
                                <td className='p-3 text-gray-800'>{product.san_pham.TenSP}</td>
                                <td className='p-3 text-center text-gray-800'>{product.SoLuong}</td>
                                <td className='p-3 text-right text-gray-800'>{new Intl.NumberFormat('vi-VN').format(product.DonGia)}đ</td>
                                <td className='p-3 text-right font-bold text-gray-800'>{new Intl.NumberFormat('vi-VN').format(product.SoLuong * product.DonGia)}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Tổng cộng */}
        <div className='flex justify-end bg-gray-50 p-4 rounded-lg'>
            <div className='text-right'>
                <p className='text-gray-600 mb-2'>Tổng cộng:</p>
                <p className='text-2xl font-bold text-amber-600'>
                    {info?.chi_tiet_don_hang && new Intl.NumberFormat('vi-VN').format(
                        info.chi_tiet_don_hang.reduce((sum, p) => sum + (p.SoLuong * p.DonGia), 0)
                    )}đ
                </p>
            </div>
        </div>

 
    </div>
</div>}

        </div>
    </div>);
}

export default Dash3;