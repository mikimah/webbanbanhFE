import DanhMucCard from "./DanhMucCard.jsx";
import bgImg from '../assets/images/danhMucBg.jpg';

function SmDanhMuc({items}) {
    function renderDanhMucCards() {
        const itemCards = [];
        for (let i = 0; i < 4; i++) {
            itemCards.push(<DanhMucCard key={i} item={items[i]} />);
        }
        return itemCards;
    }
    return(
    <div className="w-[100%] h-[40rem] relative font-inter">
        <div className="w-[100%] h-[100%] bg-black/45 absolute  flex flex-col justify-center items-center">
            <h1 className="text-white text-4xl font-bold absolute top-10">DANH MỤC</h1>
            <div className="w-full h-[60%] flex items-center justify-around">
                {renderDanhMucCards()} 
            </div>
            <a href="/product" className="absolute bottom-10 text-xl text-white border-2  p-2 rounded-[5px] font-medium hover:bg-amber-400 hover:text-white hover:border-amber-400 duration-100 hover:cursor-pointer">
                Xem thêm
            </a>
        </div>
        <div 
            className="w-[100%] h-[100%] bg-center bg-cover"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
        </div>
    </div>
    
    );
};

export default SmDanhMuc;