import { useAtom } from "jotai";
import {
  friendLinkAtom,
  isSharingAtom,
  popupStateAtom,
  shareTextAtom,
  webSiteShareUrl,
} from "../pages/Home";
import { useEffect, useState } from "react";
import axios from "axios";
import { copyToClipboard, getCookie } from "../Helper";
import { isMobile } from "react-device-detect";
import useWebShare from "react-use-web-share";

export default function Invite() {
 
  const [shareText, setShareText] = useAtom(shareTextAtom);
  const [isSharing, setSharing] = useAtom(isSharingAtom);
  const [popupState, setPopupState] = useAtom(popupStateAtom);
  const [friendLink, setFriendLink] = useAtom(friendLinkAtom);
  const [gameMinutes, setGameMinutes] = useState(3);
  const updateMinOnServer = (min) => {
    setGameMinutes(min);
    if (min == false) min = 0;
    axios
      .post(
        import.meta.env["VITE_REACT_APP_API"] + "/updateRoomTime",
        {
          roomId: friendLink.replace(webSiteShareUrl + "?room=", ""),
          time: min,
        },
        {
          headers: {
            Authorization: getCookie("authToken"),
          },
        }
      )
      .then((response) => {
     
      })
      .catch((error) => {});
  };
  const { loading, isSupported, share } = useWebShare();
  const [copyLink, setCopyLink] = useState("COPY LINK");
  return (
    <>
      {popupState === "invite" && (
        <div className="invite-block">
          <p>Send this link to a friend to start playing together</p>
          <input type="text" disabled className="copy" value={friendLink} />
          <p>Game Limit:</p>
          <div className="button-block">
            <div>
              <button
                className={gameMinutes == 3 && "selected"}
                onClick={() => {
                  updateMinOnServer(3);
                }}
              >
                3m
              </button>
              <button
                onClick={() => {
                  updateMinOnServer(10);
                }}
                className={gameMinutes == 10 && "selected"}
              >
                10m
              </button>
              <button
                onClick={() => {
                  updateMinOnServer(30);
                }}
                className={gameMinutes == 30 && "selected"}
              >
                30m
              </button>
            </div>
            <button
              onClick={() => {
                updateMinOnServer(false);
              }}
              className={gameMinutes == false && "selected"}
            >
              Find all words
            </button>
          </div>
          <button
            className="double-text-button blue-button full-button"
            onClick={() => {
             
              navigator.clipboard.writeText(friendLink);
              //copyToClipboard(friendLink);
              setCopyLink("LINK COPIED");
              setTimeout(() => {
                setCopyLink("COPY LINK");
              }, 2000);
            }}
          >
            {copyLink}
          </button>
          <button
            className="double-text-button green-button full-button"
            onClick={() => {
              var text = `Play Spelling Beat with me: `+friendLink;

            

              if (isSupported && isMobile) {
                navigator.share({
                  

                  text: text,
                 

                });
              } else {
                setShareText(text);
                setSharing(true);
              }
            }}
          >
            SHARE
          </button>
          <p>
            Don't close this page. As soon as your friend opens the link, the
            game will start.
          </p>
          <button
            className="cancel-button"
            onClick={() => {
              axios
                .post(
                  import.meta.env["VITE_REACT_APP_API"] + "/clearRoom",
                  {
                    roomId: friendLink.replace(webSiteShareUrl + "?room=", ""),
                  },
                  {
                    headers: {
                      Authorization: getCookie("authToken"),
                    },
                  }
                )
                .then((response) => {})
                .catch((error) => {});
              setPopupState(false);
            }}
          >
            CANCEL
          </button>
        </div>
      )}
    </>
  );
}
