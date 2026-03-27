import {Plus,Trash,Pencil} from 'lucide-react'
import { useState,useEffect } from 'react';
import api from '../api/api';
import { upLoadImage } from '../utils/cloudinary';
import { showError,showSuccess } from '../utils/notify';
function SmD12(){
    const [search,setSearch]=useState('');
    const [add,setAdd]=useState(false);
    const [update,setUpdate]=useState(false);
    const [del,setDel]=useState(null);
    const [id,setId]=useState(0);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [items,setItems]=useState([]);


     function handleSetUpdate(item){
        setId(item.MaDM);
        setName(item.TenDM);
        setUpdate(!update);
     }

    async function handleSearch(e){
            e.preventDefault();
        if(search.trim()===""){
            return;
        }
        try{
            const response = await api.get(`/category/name/${search.trim()}`);
            if(response.data.status === 200){
                setItems(response.data.items);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi tìm kiếm");
        }
    }

    async function handleAdd(e){
        e.preventDefault();
        const { status, url, public_id, message } = await upLoadImage(image);
        if(status !== 200){
            showError(message);
            return;
        }

        try{
            const response = await api.post("/category/add",{
                name: name,
                image: url
            });
            if(response.data.status==200){
                showSuccess(response.data.message);
                getAllItems();
                setAdd(false);
                setName("");
                setImage(null);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra");
        }
        
    }

    async function handleUpdate(e){
        e.preventDefault();

        // ✅ Kiểm tra input
        if (!name.trim()) {
            showError("Vui lòng nhập tên danh mục");
            return;
        }

        try {
            let imageUrl = null;
            // ✅ Nếu có chọn ảnh mới thì upload
            if (image) {
                const { status, url, public_id, message } = await upLoadImage(image);
                if(status !== 200){
                    showError(message);
                    return;
                }
                imageUrl = url;
            }

            // ✅ Gửi API update
            const response = await api.post(`/category/${id}`, {
                name: name,
                image: imageUrl // ✅ Nếu null thì backend không update ảnh
            });

            if(response.data.status == 200){
                showSuccess(response.data.message);
                getAllItems();
                setUpdate(false);
                resetVal();
            }
        } catch(e){
            console.log(e);
            showError("Có lỗi xảy ra");
        }
        
    }

    async function handleDelete(idx) {
        try{
            const response = await api.delete(`/category/${idx}`);
            if(response.data.status==200){
                showSuccess(response.data.message);
                getAllItems();
            }else{
                showError(response.data.message);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra");
        }
    }

    async function getAllItems() {
        try{
            const response = await api.get("/category");
            if(response.data.status==200){
                setItems(response.data.items);
                console.log(response.data.items);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra");
        }
    }

    function resetVal(){
        setId(0);
        setName('');
        setImage(null);
    }

    useEffect(()=>{
        getAllItems();
    },[])


    return(
    <div className="w-full h-full relative">
        <div className='flex items-center justify-between p-9'>
            <span className='text-3xl font-bold'>Quản lý danh mục</span>
            <button 
            onClick={()=>{setAdd(true);}}
            className='flex items-center rounded-[5px] text-white text-xl bg-amber-400 p-2 duration-75 hover:cursor-pointer hover:bg-amber-600'>
                <Plus size={30}/>
                Thêm danh mục
            </button>
        </div>
        
        <form className='w-[95%] m-auto'
        onSubmit={handleSearch}>
            <div className='flex items-center gap-2 '>
                <div className='flex-1 relative'>
                    <input 
                    type="search"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);

                        if (value === "") {
                            getAllItems();
                        }
                    }}
                    placeholder='Tìm kiếm danh mục...'
                    className='border-gray-300 border w-full p-2  rounded-[5px]'
                    />

                </div>
                <button 
                type="submit"
                className='hover:cursor-pointer bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-[5px] duration-200'
                >
                    Tìm kiếm 
                </button>
            </div>
        </form>

        <div className='w-[95%] h-[72%] m-auto mt-5'>
            <table className='table-auto w-full bg-red-400'>
                <thead>
                <tr className='bg-gray-200 text-md text-gray-500 grid grid-cols-3'>
                    <th className='col-span-1 p-2'>DANH MỤC</th>
                    <th className='col-span-1 p-2'>HÌNH ẢNH</th>
                    <th className='col-span-1 p-2'>THAO TÁC</th>
                </tr>
                </thead>
            </table>
            <div className="w-full h-[400px] overflow-y-scroll">
                <table className="table-auto w-full">
                    <tbody className="divide-y-2 divide-gray-300">
                        {items.map((item, index) => (
                        <tr
                            className="bg-gray-100 font-bold grid grid-cols-3 h-auto divide-x-2 divide-gray-300"
                            key={index}
                        >
                            <td className="col-span-1 p-2 flex items-center justify-center">
                            {item.TenDM}
                            </td>
                            <td className="col-span-1 p-2 flex items-center justify-center">
                            <img className="h-20 w-20" src={item.HinhDM} alt="pic" />
                            </td>
                            <td className="col-span-1 p-2 text-white flex items-center justify-center gap-10">
                            <button
                                className="bg-blue-500 rounded-[5px] p-2 flex gap-2 duration-75 hover:scale-[1.1] hover:cursor-pointer"
                                onClick={() => handleSetUpdate(item)}
                            >
                                Sửa <Pencil size={20} />
                            </button>
                            <button
                                className="bg-red-500 rounded-[5px] p-2 flex gap-2 duration-75 hover:scale-[1.1] hover:cursor-pointer"
                                onClick={() => setDel(item)}
                            >
                                Xoá <Trash size={20} />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>


        {add &&
        <div className='flex items-center justify-center w-full h-full bg-black/30 fixed top-0 left-0 right-0 bottom-0 z-50'>
            <form 
            className='bg-white w-[90%] max-w-[500px] rounded-lg shadow-2xl py-8 px-6 flex flex-col gap-6'
            onSubmit={handleAdd}>    
                
                <div className='flex items-center justify-between mb-2'>
                    <h2 className='text-3xl font-bold text-gray-800'>Thêm danh mục</h2>
                    <button
                    type='button'
                    className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                    onClick={()=>{setAdd(false);resetVal();}}
                    >×</button>
                </div>

                {/* Tên danh mục */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="category_name" className='text-lg font-semibold text-gray-700'>Tên danh mục:</label>
                    <input 
                    className='border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    type="text" id="category_name" name="category_name" 
                    placeholder='Nhập tên danh mục'
                    required/>
                </div>

                {/* Hình ảnh */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="category_image" className='text-lg font-semibold text-gray-700'>Hình ảnh:</label>
                    <input 
                    className='border border-gray-300 rounded-lg p-3 text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-white hover:file:bg-amber-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    onChange={(e)=>setImage(e.target.files[0])}
                    type="file" id="category_image" name="category_image" accept="image/*" 
                    required/>
                </div>

                {/* Nút submit */}
                <button 
                className='bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg text-lg duration-200 mt-4'
                type="submit">Thêm danh mục</button>
            </form>
        </div>    
        }

        {update &&
        <div className='flex items-center justify-center w-full h-full bg-black/30 fixed top-0 left-0 right-0 bottom-0 z-50'>
            <form 
            className='bg-white w-[90%] max-w-[500px] rounded-lg shadow-2xl py-8 px-6 flex flex-col gap-6'
            onSubmit={handleUpdate}>    
                
                <div className='flex items-center justify-between mb-2'>
                    <h2 className='text-3xl font-bold text-gray-800'>Cập nhật danh mục</h2>
                    <button
                    type='button'
                    className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
                    onClick={()=>{setUpdate(false);resetVal();}}
                    >×</button>
                </div>

                {/* Tên danh mục */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="category_name2" className='text-lg font-semibold text-gray-700'>Tên danh mục:</label>
                    <input 
                    className='border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    type="text" id="category_name2" name="category_name2"
                    placeholder='Nhập tên danh mục'
                    required/>
                </div>

                {/* Hình ảnh */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="category_image2" className='text-lg font-semibold text-gray-700'>Hình ảnh:</label>
                    <input 
                    className='border border-gray-300 rounded-lg p-3 text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-white hover:file:bg-amber-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200'
                    onChange={(e)=>{setImage(e.target.files[0])}}
                    type="file" id="category_image2" name="category_image2" accept="image/*"/>
                </div>

                {/* Nút submit */}
                <button 
                className='bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg text-lg duration-200 mt-4'
                type="submit">Cập nhật danh mục</button>
            </form>
        </div>    
        }

        {del&&
        <div className='flex items-center justify-center w-full h-full bg-black/30 fixed top-0 left-0 right-0 bottom-0 z-50'>
            <div className='bg-white w-[90%] max-w-[400px] rounded-lg shadow-2xl py-8 px-6 flex flex-col gap-6'>
                
                <div className='flex items-center justify-between mb-2'>
                    <h2 className='text-2xl font-bold text-gray-800'>Xác nhận xóa</h2>
                </div>

                <p className='text-lg text-gray-700'>Bạn có chắc chắn muốn xóa danh mục "{del.TenDM}" này không?</p>

                {/* Buttons */}
                <div className='flex gap-4 justify-end mt-4'>
                    <button 
                    type='button'
                    className='bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg text-base duration-200'
                    onClick={()=>{setDel(null)}}
                    >
                        Không
                    </button>
                    <button 
                    type='button'
                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-base duration-200'
                    onClick={()=>{handleDelete(del.MaDM);setDel(null);}}
                    >
                        Có, xóa
                    </button>
                </div>
            </div>
        </div>
        }

    </div>);
}

export default SmD12;