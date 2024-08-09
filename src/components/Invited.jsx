import { useAtom } from "jotai";
import { inviterAtom, popupStateAtom, usernameAtom } from "../pages/Home";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import axios from "axios";
import { getCookie } from "../Helper";

export default function Invited () {
    const searchParams = new URLSearchParams(window.location.search);
      const [inviter,setInviter] = useAtom(inviterAtom);
   const [username,setUsername] = useAtom(usernameAtom)
    const [popupState,setPopupState] = useAtom(popupStateAtom);
   
 const start = () => {
    axios.post(import.meta.env['VITE_REACT_APP_API']+'/joinRoom',{
        roomId: searchParams.get('room'),
    username: username       
    },{
                    headers: {
                        Authorization: getCookie('authToken')
                    }
                    
                            }).then((response)=>{
                                window.history.pushState({}, document.title, window.location.pathname);

                                if (response.data.success == true){
       
       
                                }else {
                                
setPopupState(false);
                                }
                            }).catch((error)=>{
                                window.history.pushState({}, document.title, window.location.pathname);

                            });
 }   
 return (
    
    <>
    { popupState === 'invited' && 
    <div className="main-block">
    <p className="lobby-status">{inviter} invited you to play a Game</p> 
<h4>Spelling Bee multiplayer</h4>
<p>You will be given a 6x8 grid of letters. Create words by connecting letters up, down, left, right and diagonally. You need to find as many words there as possible in 3 minutes. And earn more points than your opponent. You earn as many points as there are letters in the words you find.
Each game has its own topic. Words on the topic will earn you 10 bonus points.
</p>

<div className="nickname-block">
    <p>Nickname</p>
  <label>
    <input  value={username} onInput={(e)=>{
 var newValue = e.target.value;
 if(  /^[A-Za-z0-9 -]*$/.test(newValue)) {
    
    setUsername (e.target.value);
    return;
 }
 
    }}  type="text" />
    <button onClick={(e)=>{
      
e.target.previousSibling.focus();
    }}>
    <FaPencilAlt />
    </button>
  </label>
</div>
<div className="buttons-block">
    <button onClick={start} type="button" className="nobot double-text-button green-button">
        <h5>START THE GAME</h5>
    
    </button>
    <button className="cancel-button" onClick={()=>{
       
        setPopupState(false)
    }}>CANCEL</button>
</div>
</div>
    }
    </>
 )
}