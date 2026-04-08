import bannerImgT2 from '../assets/images/bannerT2Img.png';
import bannerImg from '../assets/images/bannerImg.png';
import banner2Img from '../assets/images/banner2Img.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../assets/styles/Banner.css'; // ✅ Custom CSS

function Banner({title,type}) {

    const banners = [
        { id: 1, url: bannerImg},
        { id: 2, url: banner2Img},
    ];

    function renderBanner(type){
        if(type === 1){
            return(
                <div className="w-[100%] h-[100%] ">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        loop={true} // ✅ Thêm loop để wrap around
                        className="h-full overflow-hidden banner-swiper"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <div 
                                    className="w-full h-full bg-cover bg-center flex items-center justify-center"
                                    style={{ backgroundImage: `url(${banner.url})` }}
                                > 
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            );
        }else{
            return(
                <div 
                    className="w-[100%] h-[100%] bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerImgT2})` }}
                >
                </div>
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
            return null;
        }
    }

    return (
        <div className={`w-[100%] relative ${type === 1 ? 'h-[40rem]' : 'h-[20rem]' }`}>
            <div className={`w-[100%] h-[100%]  absolute text-white `}>
                {renderTitle(title)}
            </div>
            {renderBanner(type)}
        </div>
    );
}

export default Banner;