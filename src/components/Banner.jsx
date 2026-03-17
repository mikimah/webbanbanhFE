import bannerImg from '../assets/bannerImg.jpg';


function Banner({title,type}) {
    function renderBanner(type){
        if(type === 1){
            return(
                <div className="w-[100%] h-[100%] bg-[url(/src/assets/bannerImg.jpg)] bg-cover bg-center"></div>
            );
        }else{
            return(
                <div className="w-[100%] h-[100%] bg-[url(/src/assets/banner2Img.jpg)] bg-cover bg-center"></div>
            );
        }
    }
    function renderTitle(title){
        if(title){
            return(
                <>
                    <p className="font-extrabold font-inter text-4xl absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">{title[0]}</p>
                    <p className="whitespace-nowrap font-light font-inter text-xl absolute top-[64%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">{title[1]}</p>
                </>
            );
        }else{
            return(
                <>
                    <p className="absolute right-[5%] top-[30%] text-5xl font-light italic">
                    Crafted with care, baked to perfection,
                    </p>
                    <p className="absolute right-[5%] top-[40%] text-5xl font-extralight italic">
                        Your daily dose of joy
                    </p>
                </>
            );
        }
    }

    return (
        <div className={`w-[100%]  relative ${type === 1 ? 'h-[40rem]' : 'h-[20rem]' }`}>
            <div className="w-[100%] h-[100%] bg-black/45 absolute text-white ">
                {renderTitle(title)}
            </div>
            {renderBanner(type)}

        </div>
        
    );
}

export default Banner;