import api from '../api/api';
import {useState,useEffect} from 'react'
import { useCart } from '../context/CartContext';
function DanhMucPart({item}){
    const {addToCart} = useCart();
    const id=item.MaDM;
    const [items,setItems]=useState([]);
    async function getItems(id) {
        try{
            const response = await api.get(`/product/cate/${id}`);
            if(response.data.status==200){
                console.log(response.data.items);
                setItems(response.data.items);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi lấy dữ liệu");
        }
    }
    function formatCurrency(value) {
    // Intl.NumberFormat sẽ tự động thêm dấu chấm ngăn cách hàng nghìn theo locale 'vi-VN'
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
    }
    function renderSanPhamCard(items){
         if (!Array.isArray(items)) return null; // hoặc []
        return items.map((item,i)=>(
                <div className=" h-[90%] w-full font-inter flex flex-col "
                key={i}>
                    <a className=' h-[70%] mb-3' href={`/product/${item.MaSP}`}><img className="h-full m-auto hover:scale-[1.1] duration-500 hover:cursor-pointer"  src={item.image_url} alt="img san pham" /></a>
                    <a href={`/product/${item.MaSP}`}><p className="text-2xl hover:text-amber-400 duration-75 hover:cursor-pointer">{item.TenSP}</p></a>
                    <p className="text-xl text-amber-400">{formatCurrency(item.GiaSP)}</p>
                    <button onClick={() => addToCart(item.MaSP,item)}
                     className="font-medium text-sm border-2 p-1 py-3 rounded-[5px] hover:cursor-pointer hover:text-white hover:border-amber-400 hover:bg-amber-400 duration-100">Thêm vào giỏ hàng</button>
                </div>
        ));
    }
    
    useEffect(()=>{getItems(id);},[]);
    return(<div 
    id={`section${item.MaDM}`}
    className="w-full min-h-[40rem] relative ">
        <div className="w-full h-auto flex flex-col items-center justify-center gap-3">
            <div className="w-full  h-auto flex items-center justify-center gap-4">
                <hr className="w-[10%] border border-amber-500"/>
                <h1 className="text-2xl text-amber-500">BAKED TO AWAKEN YOU</h1>
                <hr className="w-[10%] border border-amber-500"/>
            </div>
            <h1 className="text-amber-500 text-5xl">{item.TenDM.toUpperCase()}</h1>
        </div>
        <div className="grid grid-cols-4 gap-4 w-full m-auto my-5 h-auto">
            {renderSanPhamCard(items)}
        </div>
    </div>);
}

export default DanhMucPart;
