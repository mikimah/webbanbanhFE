import { useNavigate } from "react-router";
import introImg from '../assets/introImg.jpg';

function SmIntro() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/about");
    };

    return (
        <div className="w-[100%] h-[40rem] flex  relative  font-inter">
            <div className="h-[100%] w-[35%]  flex items-center justify-end">
                <img src={introImg} alt="picSmallIntro"
                className="h-[75%] w-auto rounded-[5px]"
                />
            </div>
            <div className="h-[100%] w-[65%] gap-10 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-inter italic font-bold">“Về Amai Delight</h1>
                <p className="text-2xl w-[75%] font-medium "> &nbsp;&nbsp;&nbsp; Chào mừng bạn đến với tiệm bánh của chúng tôi – nơi hương thơm ngọt ngào lan tỏa từ lò nướng mỗi ngày. Chúng tôi mang đến những chiếc bánh tươi ngon, được làm từ nguyên liệu chọn lọc và tình yêu dành cho nghề. Tại đây, bạn không chỉ thưởng thức hương vị tuyệt vời mà còn cảm nhận được sự ấm áp, gần gũi như đang ở nhà.”</p>
                <button
                 onClick={handleButtonClick}
                 className="text-xl border-2 text-white bg-gray-950 p-2 rounded-[5px] font-medium hover:cursor-pointer hover:bg-white  hover:text-gray-950 duration-100">Xem thêm</button>
            </div>
        </div>
    );
} 



export default SmIntro;