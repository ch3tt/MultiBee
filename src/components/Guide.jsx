import { useAtom } from "jotai"
import { isDarkAtom, popupStateAtom, soundAtom, statsLoadedAtom } from "../pages/Home"
import { IoMdClose } from "react-icons/io";
import { Button, Switch } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../Helper";

export default function Guide () {
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
    {popupState === 'guide' &&
     <> 
     <div className="popupOver guide-block">
     <div className="stats-block__header popupOver__header">
            <h5>HOW TO PLAY</h5>
          </div>
           <a className="close" onClick={() => {setPopupState(false)}}>
    <IoMdClose  size={24}/>
    </a>
     <div className="guide">
        
        <p>Create words using letters from the hive and to get maximum score.</p>
        <ul>
            <li>Words must have at least four letters.</li>
            <li>Words must include the center letter</li>
            <li>Letters can be used more than once</li>
            <li>Words with hyphens, proper nouns, vulgarities, and especially obscure words are not in the words list.</li>
        </ul>
        <p><b>Score points to win.</b></p>
        <ul>
            <li>You need to find as many words as possible in a given time and score more points than your opponent.</li>
            <li>Words earn 1 points per letter</li>
            <li>Words found by your opponent earlier will not be counted for you.</li>
            <li>Each puzzle includes at least one “pangram” which uses every letter. These are worth 10 extra points!            </li></ul>
     </div>
     </div>
    </>} </> )
}