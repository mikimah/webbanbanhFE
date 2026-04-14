
import { useState } from 'react';

function Dash2(){
    const [search,setSearch]=useState('');
    function handleSubmit(e){
        e.preventDefault();
        console.log(search);
    }
    return(<div className="w-full h-full flex items-center bg-gray-100 font-inter">
        
        <div className="m-auto w-[95%] h-[95%] rounded-[5px] shadow-2xl bg-white">
        <div className='flex items-center justify-between p-9'>
            <span className='text-3xl font-bold text-gray-700'>Quản lý người dùng</span>
            
        </div>
        
        <form className='w-[95%] m-auto '
        onSubmit={handleSubmit}>
            <input type="search"
            onChange={(e)=>{setSearch(e.target.value)}}
            placeholder='Tìm kiếm sản phẩm...'
            className='border-gray-300 border w-full p-2 rounded-[5px] '
            />
        </form>

        <div className=' w-[95%] h-[75%] m-auto mt-5 '>
            <table className='table-auto w-full bg-red-400 '>
                <thead>
                    <tr className='bg-gray-200 text-md text-gray-500 grid grid-cols-6'>
                    <th className='col-span-1 p-2'>NGƯỜI DÙNG</th>
                    <th className='col-span-1 p-2'>HỌ VÀ TÊN</th>
                    <th className='col-span-1 p-2'>EMAIL</th>
                    <th className='col-span-1 p-2'>ĐỊA CHỈ</th>
                    <th className='col-span-1 p-2'>SĐT</th>
                    <th className='col-span-1 p-2'>THAO TÁC</th>
                    </tr>
                </thead>
                
            </table>
        </div>
        </div>
    </div>);
}

export default Dash2;