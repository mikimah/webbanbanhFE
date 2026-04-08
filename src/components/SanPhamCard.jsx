import { useCart } from "../context/CartContext";
import defImg from "../assets/images/defProductImg.png"

function SanPhamCard({item}){

    const { addToCart } = useCart();

    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
    }
    
    function renderCard(item){
        if(item==null){
            return(
                <div className=" h-[90%] w-[20%] font-inter flex flex-col ">
                    <img 
                    className="h-[65%] m-auto hover:scale-[1.1] duration-500 hover:cursor-pointer"  
                    src={defImg} 
                    alt="img san pham" 
                    />
                    <p className="text-2xl hover:text-amber-400 duration-75 hover:cursor-pointer">Sản phẩm</p>
                    <p className="text-xl text-amber-400">67.000đ</p>
                    <button className="font-medium text-sm border-2 p-1 rounded-[5px] hover:cursor-pointer hover:text-white hover:border-amber-400 hover:bg-amber-400 duration-100">Thêm vào giỏ hàng</button>
                </div>
            );
        }else{
            return(
                <div className=" h-[90%] w-[20%] font-inter flex flex-col ">
                    <a className=' h-[70%] mb-3' href={`/product/${item.MaSP}`}>
                    <img 
                    className="h-full m-auto hover:scale-[1.1] duration-500 hover:cursor-pointer"  
                    src={item.image_url || defImg} 
                    alt="img san pham" 
                    />
                    </a>
                    <a href={`/product/${item.MaSP}`}>
                    <p className="text-2xl hover:text-amber-400 duration-75 hover:cursor-pointer">{item.TenSP}</p>
                    </a>
                    <p className="text-xl text-amber-400">{formatCurrency(item.GiaSP)}</p>
                    <button onClick={() => addToCart(item.MaSP,item)}
                     className="font-medium text-sm border-2 p-1 rounded-[5px] hover:cursor-pointer hover:text-white hover:border-amber-400 hover:bg-amber-400 duration-100">Thêm vào giỏ hàng</button>
                </div>
            );
        }
    }
    return(<>
        {renderCard(item)}
    </>);
}
export default SanPhamCard;