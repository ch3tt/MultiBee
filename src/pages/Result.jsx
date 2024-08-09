import { useAtom } from "jotai";
import {
  blueScoreAtom,
  blueTopicWordsAtom,
  blueWordsAtom,
  firstPlayerAtom,
  gameLettersAtom,
  gameStatusAtom,
  guessedWordsAtom,
  isSharingAtom,
  redScoreAtom,
  redTopicWordsAtom,
  redWordsAtom,
  rematchIdAtom,
  resultOppConnectedAtom,
  secondPlayerAtom,
  shareTextAtom,
  usernameAtom,
} from "./Home";
import { useEffect, useState } from "react";
//from "./../versus-assets/loseEmoji.png";
import winEmoji from "./../versus-assets/winEmoji.png";
import tieEmoji from "./../versus-assets/tieEmoji.png";
import { PiShareFat } from "react-icons/pi";
import axios from "axios";
import { getCookie } from "../Helper";
import { isMobile } from "react-device-detect";
import useWebShare from "react-use-web-share";

export default function Result() {
  const [guessedWords] = useAtom(guessedWordsAtom);
  const [isGenerated, setGenerated] = useState(false);
  useEffect(() => {
    if (!isGenerated) setGenerated([Math.random(), Math.random()]);
    console.log([Math.random(), Math.random()]);
  }, []);
  const LoseEmoji = ({ user }) => {
    return (
      <img src={"/lose/" + (1 + Math.floor(isGenerated[user] * 23)) + ".png"} />
    );
  };
  const WinEmoji = ({ user }) => {
    return (
      <img src={"/win/" + (1 + Math.floor(isGenerated[user] * 22)) + ".png"} />
    );
  };
  const TieEmoji = ({ user }) => {
    return (
      <img src={"/tie/" + (1 + Math.floor(isGenerated[user] * 13)) + ".png"} />
    );
  };
  const { loading, isSupported, share } = useWebShare();
  const [rematchId, setRematchId] = useAtom(rematchIdAtom);
  const [gameLetters, setGameLetters] = useAtom(gameLettersAtom);
  const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
  const requestRematch = () => {
    axios
      .post(
        import.meta.env["VITE_REACT_APP_API"] + "/startRematch",
        {
          roomId: rematchId,
        },
        {
          headers: {
            Authorization: getCookie("authToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.success == true) {
          setAnimatedRemach("Rematch");
        }
      });
  };

  const [animatedRematch, setAnimatedRemach] = useState(false);
  useEffect(() => {
    if (animatedRematch === "Rematch..")
      setTimeout(function () {
        setAnimatedRemach("Rematch");
      }, 500);
    else if (animatedRematch === "Rematch.")
      setTimeout(function () {
        setAnimatedRemach("Rematch..");
      }, 500);
    else if (animatedRematch === "Rematch")
      setTimeout(function () {
        setAnimatedRemach("Rematch.");
      }, 500);
  }, [animatedRematch]);
  const [firstPlayerName, setFirstPlayerName] = useAtom(firstPlayerAtom);
  const [secondPlayerName, setSecondPlayerName] = useAtom(secondPlayerAtom);
  const [blueScore, setBlueScore] = useAtom(blueScoreAtom);
  const [redScore, setRedScore] = useAtom(redScoreAtom);
  const [oppConnection] = useAtom(resultOppConnectedAtom);
  const [blueTopicWords, setBlueTopicWords] = useAtom(blueTopicWordsAtom);
  const [redTopicWords, sedRedTopicWords] = useAtom(redTopicWordsAtom);
  const [shareText, setShareText] = useAtom(shareTextAtom);
  const [isSharing, setSharing] = useAtom(isSharingAtom);
  const [blueWords, setBlueWords] = useAtom(blueWordsAtom);
  const [redWords, sedRedWords] = useAtom(redWordsAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [win, setWin] = useState(
    blueScore > redScore ? "win" : redScore > blueScore ? "lose" : "tie"
  );
  return (
    <>
      <div className="game-block">
        <div className="game-block__header">
          <div className="player1 player">
            <div>
              <p>{firstPlayerName.charAt(0).toUpperCase()}</p>
            </div>
            <p>{firstPlayerName}</p>
          </div>

          <div className="player2 player">
            <p>{secondPlayerName}</p>
            <div>
              <p>{secondPlayerName.charAt(0).toUpperCase()}</p>
            </div>
          </div>
        </div>
        <div className="game-block__topic">
          <p></p>
          <div className="gameScore">
            <div
              style={{
                width:
                  (blueScore > 0 || redScore > 0
                    ? Math.min(
                        85,
                        Math.max(15, (blueScore / (blueScore + redScore)) * 100)
                      )
                    : 50) + "%",
              }}
              className="blue"
            >
              <p>{blueScore}</p>
            </div>
            <div
              style={{
                width:
                  (blueScore > 0 || redScore > 0
                    ? Math.min(
                        85,
                        Math.max(15, (redScore / (blueScore + redScore)) * 100)
                      )
                    : 50) + "%",
              }}
              className="red"
            >
              <p>{redScore}</p>
            </div>
          </div>
        </div>
        <div className="game-block__result">
          <h3>
            {win === "win" ? "YOU WIN!" : win === "lose" ? "YOU LOSE!" : "DRAW"}
          </h3>
          <div>
            <section>
              <div>
                {win === "win" ? (
                  <WinEmoji user={0} />
                ) : win === "lose" ? (
                  <LoseEmoji user={0} />
                ) : (
                  <TieEmoji user={0} />
                )}

                <p> {firstPlayerName}</p>
              </div>
              <div>
                <p> {secondPlayerName}</p>
                {win === "lose" ? (
                  <WinEmoji user={1} />
                ) : win === "win" ? (
                  <LoseEmoji user={1} />
                ) : (
                  <TieEmoji user={1} />
                )}
              </div>
            </section>
            <div className="stat">
              <div className="blue">{blueScore}</div>
              <p>points</p>
              <div className="red">{redScore}</div>
            </div>
            <div className="stat">
              <div className="blue">{blueWords}</div>
              <p>words</p>
              <div className="red">{redWords}</div>
            </div>
            <div className="stat">
              <div className="blue">{blueTopicWords}</div>
              <p>pangram words</p>
              <div className="red">{redTopicWords}</div>
            </div>
          </div>
          <nav>
            {oppConnection && (
              <button className="lime-button rematch" onClick={requestRematch}>
                <p> {!animatedRematch ? "Rematch" : animatedRematch}</p>
              </button>
            )}
            <button
              className="lime-button"
              onClick={() => {
                axios
                  .get(
                    import.meta.env["VITE_REACT_APP_API"] +
                      "/start?username=" +
                      username,
                    {
                      headers: {
                        Authorization: getCookie("authToken"),
                      },
                    }
                  )
                  .then((response) => {
                    if (response.data.success == true) {
                      if (!response.data.instant == true)
                        setGameStatus("searching");
                    }
                  })
                  .catch((error) => {});
              }}
            >
              New opponent
            </button>
          </nav>
          <button
            onClick={() => {
              var gameLetterString = "";
              for (var iY = 0; iY < 8; iY++) {
                for (var iX = 0; iX < 6; iX++) {
                  gameLetterString += gameLetters.charAt([iY * 6 + iX]);
                }
                gameLetterString += "\n";
              }
              var text =
                `I beat my opponent in Versus Bee!\n\n` +
                `I made ` +
                guessedWords.filter((el) => el.team == "blue").length +
                ` and my opponent made ` +
                guessedWords.filter((el) => el.team == "red").length +
                ` words from letters ` +
                gameLetterString.toUpperCase() +
                `\nCan you find more? - https://multibee.org/
                `;

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
            Share your result
          </button>
        </div>
      </div>
    </>
  );
}
