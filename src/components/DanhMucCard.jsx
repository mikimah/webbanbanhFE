import defImg from "../assets/images/defProductImg.png"

function DanhMucCard({item}){
    function renderCard(item){
        if(item==null){
            return(
                <div className="h-[90%] w-[20%] font-inter text-white flex flex-col items-center hover:scale-[1.1] duration-300 hover:cursor-pointer">
                    <img className="scale-[0.9]"  src={defImg} alt="img danh muc" />
                    <p className="text-2xl">Danh mục</p>
                </div>
            );
        }else{
            return(
                <a href={`/category/${item.MaDM}`} className="h-[90%] w-[20%] font-inter text-white flex flex-col items-center hover:scale-[1.1] duration-300 hover:cursor-pointer">
                    <img className="scale-[0.9]"  src={item.HinhDM} alt="img danh muc" />
                    <p className="text-2xl">{item.TenDM.toUpperCase()}</p>
                </a>
            );
        }
    }
    return(
    <>
        {renderCard(item)}
    </>   
    );
}

export default DanhMucCard;