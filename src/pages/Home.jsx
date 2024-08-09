import { useEffect, useState } from "react";
import Header from "../components/Header";
import Searching from "./Searching";
import { BsPeopleFill } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import Result from "./Result";
import Game from "./Game";
import { atom, useAtom } from "jotai";
import SettingsMenu from "../components/SettingsMenu";
import StatsMenu from "../components/StatsMenu";
import io from "socket.io-client";
import axios from "axios";
import { getCookie, playSound } from "../Helper";
import Invite from "../components/Invite";

import { BottomShare } from "../components/BottomShare";
import expiredEmoji from "../versus-assets/expiredEmoji.png";
import Invited from "../components/Invited";
import { Howl, Howler } from "howler";
import Guide from "../components/Guide";
import { socket } from "../main";

export const isRematchScreenAtom = atom(false);
export const gameStatusAtom = atom("lobby");
export const webSiteShareUrl = "https://multibee.org/";
export const gameEndTimeAtom = atom(0);
export const gameLettersAtom = atom("ABCDEFG");
export const firstPlayerAtom = atom("");
export const popupStateAtom = atom(false);
export const secondPlayerAtom = atom("");
export const inviterAtom = atom("");
export const rematchIdAtom = atom(false);
export const statsLoadedAtom = atom(false);
export const onlineAtom = atom(0);
export const isDarkAtom = atom(false);
export const secondsAtom = atom(0);
export const guessedWordsAtom = atom([]);
export const soundAtom = atom(true);
export const gameThemeAtom = atom("123");
export const redScoreAtom = atom(0);
export const lobbyStatusAtom = atom(false);
export const resultOppConnectedAtom = atom(false);
export const blueScoreAtom = atom(0);
export const redWordsAtom = atom(0);

export const blueWordsAtom = atom(0);
export const redTopicWordsAtom = atom(0);
export const friendLinkAtom = atom(webSiteShareUrl);
export const blueTopicWordsAtom = atom(0);
export const shareTextAtom = atom("");
export const isSharingAtom = atom(false);
const generateUsername = () => {
  return "Loading...";
};
export const usernameLoadedAtom = atom(false);
export const usernameAtom = atom("");
export const secondsBeforeAtom = atom(0);
export default function Home() {
  const [usernameLoaded, setUsernameLoaded] = useAtom(usernameLoadedAtom);
  const [inviter, setInviter] = useAtom(inviterAtom);
  const [lobbyStatus, setLobbyStatus] = useAtom(lobbyStatusAtom);

  const [statsLoaded, setStatsLoaded] = useAtom(statsLoadedAtom);
  const [gameEndTime, setGameEndTime] = useAtom(gameEndTimeAtom);
  const [rematchId, setRematchId] = useAtom(rematchIdAtom);
  const searchParams = new URLSearchParams(window.location.search);
 
  const [friendLink, setFriendLink] = useAtom(friendLinkAtom);
  const [redScore, setRedScore] = useAtom(redScoreAtom);
  const [blueScore, setBlueScore] = useAtom(blueScoreAtom);
  const [guessedWords, setGuessedWords] = useAtom(guessedWordsAtom);
  const [secondsBefore, setSecondsBefore] = useAtom(secondsBeforeAtom);

  const [blueTopicWords, setBlueTopicWords] = useAtom(blueTopicWordsAtom);
  const [redTopicWords, setRedTopicWords] = useAtom(redTopicWordsAtom);
  const [gameLetters, setGameLetters] = useAtom(gameLettersAtom);
  const [blueWords, setBlueWords] = useAtom(blueWordsAtom);
  const [redWords, setRedWords] = useAtom(redWordsAtom);

  const [resultOppCon, setResultOppCon] = useAtom(resultOppConnectedAtom);

  const loadSocketHandlers = () => {

  socket.emit('join',{
    token: getCookie("authToken"),
  });
    socket.on("connect", () => {
    
      console.log('event: connect');
    });

    socket.on ('connecting',()=> console.log('connecting'));
socket.on ('reconnecting',()=>console.log('reconnecting'));
socket.on ('connect_failed',()=>console.log('connect failed'));
socket.on ('reconnect_failed',()=>console.log('reconnect failed'));
socket.on ('close',()=> console.log('close'));

    socket.on("updateResult", (data) => {
   
      setResultOppCon(data.oppConnected);
    });
    socket.on("usernameUpdate", (data) => {
      setUsername(data.username);

      setUsernameLoaded(true);
    });
    socket.on("online", (data) => {
      setOnline(data.online);
    });
    socket.on("gameUpdate", (data) => {
   

      setGuessedWords(data.guessedWords.reverse());
      setBlueScore(data.ownScore);
      setRedScore(data.oppScore);
    });
    socket.on("gameEnd", (data) => {
      setRematchId(data.rematchId);

      setStatsLoaded(false);
      socket.emit("joinRematch", {
        roomId: data.rematchId,
      });
      if (data.ownScore > data.oppScore) {
        playSound("win");
      } else if (data.ownScore < data.oppScore) {
        playSound("loss");
      } else {
        playSound("draw");
      }

      setGameStatus("result");
      setBlueScore(data.ownScore);

      setRedScore(data.oppScore);
      setBlueWords(data.ownWords);
      setRedWords(data.oppWords);
      setGuessedWords();
      socket.emit("confirmation", {
        token: data.returnToken,
      });
      setBlueTopicWords(data.ownTopicWords);
      setRedTopicWords(data.oppTopicWords);
    });
    socket.on("gameResume", (data) => {
      setGameStatus("game");

      setSeconds(data.timeLeft);
      setGameEndTime(Math.floor(new Date() / 1000) + data.timeLeft);
      setFirstPlayerName(data.ownName);
      setSecondPlayerName(data.oppName);
      setGameLetters(data.letters.toUpperCase());
      setGuessedWords(data.guessedWords);
      setBlueScore(data.ownScore);
      setRedScore(data.oppScore);
    });
    socket.on("gameStart", (data) => {
     
      socket.emit("confirmation", {
        token: data.returnToken,
      });

      setBlueScore(0);
      setRedScore(0);

      setPopupState(false);
      setGameStatus("game");
      setGameLetters(data.letters.toUpperCase());
      setGameEndTime(Math.floor(new Date() / 1000) + 3 + data.duration);
      setSecondsBefore(3);

      setSeconds(data.duration);
      setFirstPlayerName(data.ownName);
      setSecondPlayerName(data.oppName);
    });
  };
  const setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  function eraseCookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  const [firstPlayerName, setFirstPlayerName] = useAtom(firstPlayerAtom);
  const [secondPlayerName, setSecondPlayerName] = useAtom(secondPlayerAtom);

  const [seconds, setSeconds] = useAtom(secondsAtom);

  const [sound, setSound] = useAtom(soundAtom);
  // lobby, searching, game, result
  const [popupState, setPopupState] = useAtom(popupStateAtom);
  const [isDark, setIsDark] = useAtom(isDarkAtom);
  const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
  const startSearch = () => {
    if (!usernameLoaded) {
      return;
    }
    axios
      .get(
        import.meta.env["VITE_REACT_APP_API"] + "/start?username=" + username,
        {
          headers: {
            Authorization: getCookie("authToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.success == true) {
          if (!response.data.instant == true) setGameStatus("searching");
        }
      })
      .catch((error) => {});
  };

  const [online, setOnline] = useAtom(onlineAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [isSharing, setSharing] = useAtom(isSharingAtom);
  const [isRematchScreen, setRematchScreen] = useAtom(isRematchScreenAtom);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (isLoaded) return;
    setIsLoaded(true);
    if (gameStatus !== "result") {
      if (!isRematchScreen) return;
      socket.emit("leaveResult");
    }
  }, [gameStatus]);

  useEffect(() => {
    setSharing(false);
  }, [popupState]);

  useEffect(() => {
    Howler.volume(0.2);
    
    if (getCookie("authToken") == null) {
      axios
        .get(import.meta.env["VITE_REACT_APP_API"] + "/me")
        .then((response) => {
          if (response.data.authToken != null) {
            setCookie("authToken", response.data.authToken, 30);
            loadSocketHandlers();

            if (searchParams.get("room") !== null) {
              axios
                .get(import.meta.env["VITE_REACT_APP_API"] + "/getRoomOwner?roomId=" +
              searchParams.get("room").replace('/',''))
                .then((response) => {
                  if (response.data.success == true) {
                    setInviter(response.data.nickname);
                    setPopupState("invited");
                  } else {
                    setLobbyStatus("The invitation has expired");
                  }
                })
                .catch((error) => {});
            }
          }
        })
        .catch((error) => {});
    } else {
      loadSocketHandlers();

      if (searchParams.get("room") !== null) {
        axios
          .get(
            import.meta.env["VITE_REACT_APP_API"] +
              "/getRoomOwner?roomId=" +
              searchParams.get("room").replace('/','')
          )
          .then((response) => {
            if (response.data.success == true) {
              setPopupState("invited");
              setInviter(response.data.nickname);
            } else {
              setLobbyStatus("The invitation has expired");
            }
          })
          .catch((error) => {});
      }
    }

    if (localStorage.getItem("dark") != null) {
      setIsDark(localStorage.getItem("dark") === "true");
    } else {
      localStorage.setItem("dark", "false");
      setIsDark(false);
    }
    if (localStorage.getItem("sound") != null) {
      setSound(localStorage.getItem("sound") === "true");
    } else {
      localStorage.setItem("sound", "true");
      setSound(true);
    }
  }, []);

  return (
    <>
      <div className={isDark ? "div dark-theme-on" : "div"}>
        <BottomShare />
        <Header />
        <Invited />
        <Invite />
        <SettingsMenu />
        <Guide />
        <StatsMenu />
        {popupState === false &&
          (gameStatus === "lobby" ? (
            <div className="main-block">
              {lobbyStatus != false && (
                <p className="lobby-status">
                  {lobbyStatus}{" "}
                  {lobbyStatus === "The invitation has expired" && (
                    <img src={expiredEmoji}></img>
                  )}{" "}
                </p>
              )}
              <h4>Spelling Bee multiplayer</h4>
              <p>
                You will be given a set of 7 letters. Form words by clicking on
                the letters in sequence. You need to find words consisting of 4
                or more letters. Each word must contain the central letter at
                least once. <br /> <br />
                You need to find as many words as possible in 3 minutes and
                score more points than your opponent. You earn as many points as
                there are letters in the words you find. Words found by your
                opponent earlier will not be counted for you. In each game,
                there is at least one Pangram - a word containing every letter
                from the grid at least once - for which you will receive a bonus
                of 10 points.
              </p>

              <div className="nickname-block">
                <p>Nickname</p>
                <label>
                  <input
                    value={!usernameLoaded ? "Loading..." : username}
                    disabled={!usernameLoaded}
                    onInput={(e) => {
                      var newValue = e.target.value.substring(0, 11);

                      if (/^[A-Za-z0-9 -]*$/.test(newValue)) {
                        setUsername(newValue);
                        return;
                      }
                    }}
                    type="text"
                  />
                  <button
                    onClick={(e) => {
                      e.target.previousSibling.focus();
                    }}
                  >
                    <FaPencilAlt />
                  </button>
                </label>
              </div>
              <div className="buttons-block">
                <button
                  onClick={startSearch}
                  type="button"
                  className="double-text-button green-button"
                >
                  <h5>START THE GAME</h5>
                  <p>Play a random opponent</p>
                </button>
                <button
                  onClick={() => {
                    if (!usernameLoaded) return;
                    axios
                      .post(
                        import.meta.env["VITE_REACT_APP_API"] + "/createRoom",
                        {
                          username: username,
                        },
                        {
                          headers: {
                            Authorization: getCookie("authToken"),
                          },
                        }
                      )
                      .then((response) => {
                        if (response.data.success == true) {
                          setPopupState("invite");
                          setFriendLink(
                            webSiteShareUrl + "?room=" + response.data.roomId
                          );
                        }
                      });
                  }}
                  type="button"
                  className="double-text-button blue-button"
                >
                  <h5>INVITE A FRIEND</h5>
                  <p>Generate link to the game</p>
                </button>
              </div>
              <div className="online-block">
                <BsPeopleFill color="#47BF41" />
                <p>{online} Players online</p>
              </div>
            </div>
          ) : gameStatus === "searching" ? (
            <Searching />
          ) : gameStatus === "game" ? (
            <Game />
          ) : gameStatus === "result" ? (
            <Result />
          ) : (
            <></>
          ))}
      </div>
    </>
  );
}
