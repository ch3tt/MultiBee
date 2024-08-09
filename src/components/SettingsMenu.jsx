import { useAtom } from "jotai"
import { isDarkAtom, popupStateAtom, soundAtom, statsLoadedAtom } from "../pages/Home"
import { IoMdClose } from "react-icons/io";
import { Button, Switch } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../Helper";

export default function SettingsMenu () {
    const [sound,setSound] = useAtom(soundAtom);
    const [statsLoaded,setStatsLoaded] = useAtom(statsLoadedAtom);
    const [isDark,setDark] = useAtom(isDarkAtom);
    const [resetPopupActive,setResetPopupActive] = useState(false)
    const themeToggle = (checked) => {
setDark(checked);
    localStorage.setItem('dark',checked);

    }
    const soundToggle = (checked) => {
        setSound(checked);
            localStorage.setItem('sound',checked);
      
            }

    const [popupState,setPopupState] = useAtom(popupStateAtom)
  
    useEffect(()=>{
        setResetPopupActive(false);
    },[popupState])
    return (<>
    {popupState === 'settings' &&
     <>  { resetPopupActive &&
        <div className="settings-block__popup__wrapper" onClick={()=>{setResetPopupActive(false)}}>
        <div className="settings-block__popup" onClick={(e)=>{e.stopPropagation()}}>
            <div className="settings-block__popup__header">
    <p> Reset Statistics </p>
            </div>
            <div className="inner">
    <p>Are you sure?</p>
    <button onClick={()=>{
        setResetPopupActive(false);
        axios.post(import.meta.env['VITE_REACT_APP_API']+'/resetStat',{},{
            headers: {
                Authorization: getCookie('authToken')
            }
            
                    }).then((response)=>{
                     
                      setStatsLoaded(false);
                    })
    }} className="double-text-button red-button">
    <h5>RESET MY STATISTICS</h5>
            <p>THIS CANNOT BE UNDONE.</p>
    </button>
    <button onClick={()=>{
        setResetPopupActive(false);
    }} className="double-text-button blue-button">
    <h5>CANCEL</h5>
           
    </button>
    </div>
        </div>
        </div>
    }
    <div className="settings-block popupOver">
         <a className="close" onClick={() => {setPopupState(false)}}>
    <IoMdClose  size={24}/>
    </a>
 
<div className="settings-block__header popupOver__header">
    <h5>SETTINGS</h5>
   
</div>
<div className="settings-block__toggle-wrapper">
    <div>
        <h6>Dark mode</h6>
        <p>Change dark and light mode</p>
    </div>
<Switch      checked={isDark} onChange={themeToggle} />
</div>
<div className="settings-block__toggle-wrapper">
    <div>
        <h6>Sound on/off</h6>
        <p>Sounds indicating moves in the game</p>
    </div>
<Switch      checked={sound} onChange={soundToggle} />
</div>
<div className="settings-block__toggle-wrapper">
    <div>
        <h6>Reset Statistics</h6>
        <p>Zero out your games, wins and losses count. <br /> This cannot be undone.</p>
    </div>
<Button onClick={()=>{setResetPopupActive(true)}}>Reset</Button>
</div>
<div className="settings-block__bottom">
    <nav>
      
        <a href="mailto:hello@strands.game">Feedback</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms of Use</a>
    </nav>
    <p>v1.1.1.1-h4b38h4b8</p>
</div>
    </div>
    
    
    
    </>}
    </> )
}