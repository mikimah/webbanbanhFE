import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {CircleX,Minus,Plus} from 'lucide-react';
import { showError,showSuccess } from '../utils/notify';
import api from '../api/api';
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Cart() {
    const navigate = useNavigate();
    const { cart,removeFromCart,increaseQty,decreaseQty,clearCart} = useCart();
    const { user } = useAuth();
    const [shippingMethod, setShippingMethod] = useState("store");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [coupon, setCoupon] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [errors, setErrors] = useState({ phone: false, address: false });

    function formatCurrency(value) {
    // Intl.NumberFormat sẽ tự động thêm dấu chấm ngăn cách hàng nghìn theo locale 'vi-VN'
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
    }

    async function handlePay(){
        let newErrors = { phone: false, address: false };
        
        if(phone.trim() === ""){
            newErrors.phone = true;
        }
        
        if(shippingMethod === "home" && address.trim() === ""){
            newErrors.address = true;
        }

        setErrors(newErrors);

        // Nếu có lỗi, dừng lại
        if(newErrors.phone || newErrors.address){
            return;
        }
        
        const cartData = cart.map(item => ({
            id: item.id,
            price: item.GiaSP,
            qty: item.qty
        }));
        
        console.log({
            user: user ? user.MaND : null,
            phone,
            address: shippingMethod === "home" ? address : "Nhận tại cửa hàng",
            cart: cartData,
        });

        try{
            const response = await api.post('/order',{
                user: user ? user.MaND : null,
                coupon: isApplyingCoupon? coupon : null,
                phone,
                address: shippingMethod === "home" ? address : "Nhận tại cửa hàng",
                cart: cartData,
            });
            if(response.data.status==200){
                showSuccess("Thanh toán thành công");
                clearCart();
                navigate('/checkout') ;
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi thanh toán");
        }

   }

   async function handleApplyCoupon(e){
        e.preventDefault();
        console.log({
            TenKM: coupon,
            MaND: user.MaND,
            TongTotal: total
        });
        try{
            const response = await api.post('/coupon/apply',{
                TenKM: coupon,
                MaND: user.MaND,
                TongTotal: total
            });
            if(response.data.status==200){
                console.log(response.data);
                setIsApplyingCoupon(true);
                setTotalAfterDiscount(response.data.tongTotalSauGiam);
            }
        }catch(e){
            console.log(e);
            setIsApplyingCoupon(false);
            setTotalAfterDiscount(0);
            setCoupon("");
            showError("Có lỗi xảy ra khi áp dụng mã giảm giá");
        }
   }

   useEffect(()=>{
        setIsApplyingCoupon(false);
        setTotalAfterDiscount(0);
        setCoupon("");
       const totalTemp = cart.reduce((sum, item) => sum + (item.GiaSP * item.qty), 0);
       setTotal(totalTemp);
   }, [cart]);

    return(<>
    <Header />
    <div className=' h-auto w-[80%] m-auto flex flex-col text-gray-950  items-center text-3xl font-medium max-md:w-full'>
        <Banner title={["Cart","Giỏ hàng"]} type={2} />
        <table className="w-full mt-8 ">
            <thead>
                <tr className="bg-gray-50 rounded-[5px] border border-gray-200 text-gray-700 grid grid-cols-5 gap-4 py-2  w-full  text-2xl text-center">
                    <th></th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item,i)=>(
                    <tr key={i} className="border border-gray-200 text-center grid grid-cols-5 gap-4 py-4  w-full text-xl">
                        <td className="col-span-1 flex items-center justify-around gap-2">
                            <button className="text-red-500 hover:text-red-700 hover:cursor-pointer" onClick={() => removeFromCart(item.id)}>
                                <CircleX size={25}  />
                            </button>
                            <img className="w-[100px] h-[100px]" src={item.image_url} alt="" />
                        </td>
                        <td className="col-span-1 flex items-center justify-center">{item.TenSP}</td>
                        <td className="col-span-1 flex items-center justify-center">{formatCurrency(item.GiaSP)}</td>
                        <td className="col-span-1 flex items-center justify-center">                            
                            <div className="w-[60%] h-auto flex items-center justify-between border">
                                <button>
                                    <Minus onClick={()=>{decreaseQty(item.id)}}
                                    className=" p-2 hover:bg-amber-500 hover:text-white hover:cursor-pointer duration-100" size={40}/>
                                </button>
                                <div className="h-10 flex items-center justify-center flex-1 text-xl text-center font-medium border-x">{item.qty}</div>
                                <button>
                                    <Plus onClick={()=>{increaseQty(item.id)}}
                                     className=" p-2 hover:bg-amber-500 hover:text-white hover:cursor-pointer duration-100" size={40}/>
                                </button>    
                            </div></td>
                        <td className="col-span-1 flex items-center justify-center">{formatCurrency(item.GiaSP * item.qty)}</td>
                    </tr>
                ))}
                {cart.length===0&&(
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-2xl">Chưa có sản phẩm nào trong giỏ hàng</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="w-full mb-8 p-3 py-4 bg-gray-50 flex items-center justify-end border border-gray-200 rounded-[5px] ">
            <form onSubmit={handleApplyCoupon} 
            className="text-xl w-[25%]  flex items-center justify-center gap-2">
                <input className="border border-gray-300 p-1 w-[50%] bg-white text-center rounded-[5px]"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Mã giảm giá"
                type="text" />
                <button type="submit" className="rounded-[5px] bg-amber-400 p-1 px-3 text-white">Áp dụng</button>
            </form>
            
        </div>
        <div className="w-full  flex  gap-4  rounded-[5px] mb-8">
            <div className="w-[40%] border border-gray-200 bg-gray-50 p-4 rounded-[5px]">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 ">Phương thức giao hàng:</h1>
                <div className="flex flex-col gap-4">
                    {/* Radio button: Tại cửa hàng */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="radio" 
                            name="shipping" 
                            value="store" 
                            checked={shippingMethod === "store"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-5 h-5"
                        />
                        <span className="text-lg ">Nhận tại cửa hàng</span>
                    </label>

                    {/* Radio button: Giao tại nhà */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="radio" 
                            name="shipping" 
                            value="home" 
                            checked={shippingMethod === "home"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-5 h-5"
                        />
                        <span className="text-lg">Giao tại địa chỉ nhà</span>
                    </label>

                    {/* Input địa chỉ - hiển thị khi chọn "Giao tại nhà" */}
                    {shippingMethod === "home" && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Nhập địa chỉ giao hàng"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`border p-2 rounded-[5px] text-lg w-full bg-white ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm">Vui lòng nhập địa chỉ giao hàng</p>
                            )}
                        </>
                    )}

                    {/* Input số điện thoại */}
                    <>
                        <input 
                            type="tel" 
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`border p-2 rounded-[5px] text-lg w-full bg-white ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">Vui lòng nhập số điện thoại</p>
                        )}
                    </>
                </div>
            </div>
            <div className="w-[60%] border border-gray-200 bg-gray-50 p-4 rounded-[5px] flex flex-col gap-4">
                <h1 className="text-2xl text-gray-700 font-bold mb-4">Tổng đơn hàng:</h1>
                
                {/* Tổng số sản phẩm */}
                <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                    <span className="text-lg text-gray-700">Tổng số sản phẩm:</span>
                    <span className="text-xl font-semibold text-gray-950">{cart.reduce((sum, item) => sum + item.qty, 0)} sản phẩm</span>
                </div>

                {/* Tổng thành tiền */}
                <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                    <span className="text-lg text-gray-700">Tổng thành tiền:</span>
                    <span className="text-2xl font-bold text-amber-500">
    { isApplyingCoupon ? (
        <>
            <span className="line-through text-sm font-light mr-1 text-gray-500">{formatCurrency(total)}</span>
            <span>{formatCurrency(totalAfterDiscount)}</span>
        </>
    ) : (
        formatCurrency(total)
    )}
</span>
                </div>

                {/* Nút thanh toán */}
                <button 
                    onClick={()=>{handlePay();}}
                    disabled={cart.length === 0}
                    className={`w-full font-semibold py-3 px-4 rounded-[5px] text-lg duration-200 mt-2 ${
                        cart.length === 0 
                            ? 'bg-gray-300  text-gray-600' 
                            : 'bg-amber-400 hover:bg-amber-500 hover:cursor-pointer text-white'
                    }`}
                >
                    Tiến hành thanh toán
                </button>
            </div>
        </div>
    </div>
    <Footer/>
    </>);
}

export default Cart;