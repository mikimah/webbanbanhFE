import Loading from '../components/Loading.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Banner from '../components/Banner.jsx'
import SmIntro from '../components/SmIntro.jsx'
import SmDanhMuc from '../components/SmDanhMuc.jsx'
import SmSanPham from '../components/SmSanPham.jsx'
import {useAuth} from '../context/AuthContext';
import { useNavigate } from 'react-router'
import {useState,useEffect} from 'react'
import api from '../api/api';
import { showError,showSuccess } from '../utils/notify';
export default function Home() {
  const [dsDM,setDsDM]=useState([]);
  const [dsSP,setDsSP]=useState([]);
  const navigate = useNavigate();
  const {loading,user} = useAuth();

  async function getAllItems() {
        try{
            const response = await api.get("/category");
            if(response.data.status==200){
                setDsDM(response.data.items);
                console.log(response.data.items);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi lấy dữ liệu");
        }
  }

      async function getAllItems2(){
        try{
            const response = await api.get("/product");
            if(response.data.status==200){
                setDsSP(response.data.items);
                console.log(response.data.items);
            }
        }catch(e){
            console.log(e);
            showError("Có lỗi xảy ra khi lấy dữ liệu");
        }
    }
  


   useEffect(()=>{getAllItems();getAllItems2()},[]);

  useEffect(() => {
    if (!loading && user?.VaiTro === "admin") {
      navigate("/admin");
    }
  }, [loading, user]);

  if(loading){return <Loading/>;}

  return (
    <>
    <Header />
    <div className=' h-auto w-[80%] m-auto flex flex-col text-gray-950  items-center text-3xl font-bold max-md:w-full'>
        <Banner title={null} type={1}/>
        <SmIntro />
        <SmDanhMuc items={dsDM}/>
        <SmSanPham items={dsSP}/>
    </div>
    <Footer />
    </>
  )
}
