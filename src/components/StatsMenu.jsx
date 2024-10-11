import { useAtom } from "jotai";
import {
  isSharingAtom,
  popupStateAtom,
  shareTextAtom,
  statsLoadedAtom,
} from "../pages/Home";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { PiShareFat } from "react-icons/pi";
import axios from "axios";
import { isMobile } from "react-device-detect";

export default function StatsMenu() {
  const [shareText, setShareText] = useAtom(shareTextAtom);
  const [statsLoaded, setStatsLoaded] = useAtom(statsLoadedAtom);
  const [isSharing, setSharing] = useAtom(isSharingAtom);
  const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  const [statsData, setStatsData] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
    words: 0,
    points: 0,
  });
  useEffect(() => {
    if (!statsLoaded) {
      console.log(import.meta.env["VITE_REACT_APP_API"], 'is api url');
      axios
        .get(import.meta.env["VITE_REACT_APP_API"] + "/stats", {
          headers: {
            Authorization: getCookie("authToken"),
          },
        })
        .then((response) => {
          setStatsLoaded(true);
          setStatsData({
            wins: response.data.wins,
            draws: response.data.draws,
            losses: response.data.losses,
            words: response.data.words,
            points: response.data.points,
          });
        })
        .catch((error) => {});
    }
  });

  const [popupState, setPopupState] = useAtom(popupStateAtom);
  return (
    <>
      {popupState === "stats" && (
        <div className="stats-block popupOver">
          <a
            className="close"
            onClick={() => {
              setPopupState(false);
            }}
          >
            <IoMdClose size={24} />
          </a>
          <div className="stats-block__header popupOver__header">
            <h5>STATISTICS</h5>
          </div>
          <ul className="stats-block__list">
            <li>
              <div>{statsData.wins + statsData.losses + statsData.draws}</div>
              <p>games</p>
            </li>
            <li>
              <div>{statsData.wins}</div>
              <p>wins</p>
            </li>
            <li>
              <div>{statsData.draws}</div>
              <p>draws</p>
            </li>
            <li>
              <div>{statsData.losses}</div>
              <p>losses</p>
            </li>
            <li>
              <div>
                {statsData.wins + statsData.losses > 0
                  ? Math.floor(
                      (statsData.wins / (statsData.losses + statsData.wins)) *
                        100
                    )
                  : 0}
              </div>
              <p>% of wins</p>
            </li>
            <li>
              <div>{statsData.words}</div>
              <p>words</p>
            </li>
            <li>
              <div>{statsData.points}</div>
              <p>points</p>
            </li>
          </ul>
          <button
            onClick={() => {
              var text =
                `My stats in Spelling Beat. Can you beat it? https://spellingbeat.org/
                \n
                Games - ${(statsData.wins + statsData.losses + statsData.draws)}
                \nWins - ${statsData.wins}
                \nDraws - ${statsData.draws}
                \nLosses - ${statsData.losses}
                \n% of Wins - ${(statsData.wins + statsData.losses > 0
                  ? Math.floor(
                      (statsData.wins / (statsData.losses + statsData.wins)) *
                        100
                    )
                  : 0)} %
                \nWords - ${statsData.words}
                \nPoints - ${statsData.points}`

              if (navigator.share && isMobile) {
                navigator.share({
                  text: text,
                });
              } else {
                setShareText(text);
                setSharing(true);
              }
            }}
          >
            Share your stats
          </button>
        </div>
      )}
    </>
  );
}
