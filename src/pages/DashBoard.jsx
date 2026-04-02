import SideBar from "../components/SideBar";
import Dash1 from "../components/Dash1";
import Dash2 from "../components/Dash2";
import Dash3 from "../components/Dash3";
import { useState } from "react";
function DashBroad() {
    const [page,setPage]=useState(1);
    function handleSetPage(x){
        setPage(x);
    }
    function renderPage(x){
        if(x==1) return <Dash1/>;
        else if(x==2) return <Dash2/>;
        else return <Dash3/>;
    }
    return (
        <div className="flex min-h-screen w-screen">
            <div className="bg-blue-500 w-[14%] z-20">
                <SideBar handleSetPage={handleSetPage} page={page}/>
            </div>
            <div className="bg-red-500 w-[86%] z-10">
                {renderPage(page)}
            </div>
        </div>
    );
}

export default DashBroad;