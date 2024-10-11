import { useAtom } from "jotai"
import React, { useEffect, useRef, useState } from "react"
import { useGlobalAudioPlayer } from "react-use-audio-player"
import { blueScoreAtom, firstPlayerAtom, gameEndTimeAtom, gameLettersAtom, gameThemeAtom, guessedWordsAtom, redScoreAtom, secondPlayerAtom, secondsAtom, secondsBeforeAtom } from "./Home"
import { LuRefreshCw } from "react-icons/lu"

import axios from "axios"
import { CiBellOff } from "react-icons/ci"
import { playSound } from "../Helper"
import flash from "./../versus-assets/flash.png"
import { loadable } from "jotai/utils"
import { CgNametag } from "react-icons/cg"
export default function Game() {
  const [floaterStatus, setFloaterStatus] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [isSendCooldownActive, setSendCooldownActive] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)
  const [gameEndTime, setGameEndTime] = useAtom(gameEndTimeAtom)
  const [letterChain, setLetterChain] = useState([])
  const { load } = useGlobalAudioPlayer()
  const [lastFullWord, setLastFullWord] = useState([])
  const popLetter = () => {
    var letterChainT = [...letterChain]
    letterChainT.pop()
    setLetterChain(letterChainT)
  }
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  }
  const keyPress = (e) => {
    if (document.querySelector(".game-block__hex") != null) {
      var currentData = JSON.parse(document.querySelector(".game-block__hex").getAttribute("data-letters"))
      var avail = document.querySelector(".game-block__hex").getAttribute("data-avail")
      if (e.key == "Backspace") {
        currentData.pop()
        setLetterChain(currentData)
        return
      }

      if (e.key == "Enter") {
        requestWord(currentData)
        return
      }
      if (avail != null && avail.includes(e.key.toUpperCase())) {
        currentData.push(e.key.toUpperCase())
        playSound("letter")
        setLetterChain(currentData)
      }
    }
  }
  function reroll() {
    var letterList = ""
    letterList += gameLetters.charAt(0)
    letterList += gameLetters.charAt(1)
    letterList += gameLetters.charAt(2)
    letterList += gameLetters.charAt(4)
    letterList += gameLetters.charAt(5)
    letterList += gameLetters.charAt(6)

    String.prototype.shuffle = function () {
      var a = this.split(""),
        n = a.length

      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
      }
      return a.join("")
    }
    letterList = letterList.shuffle()

    var t1 = letterList.substring(0, 3)

    var t2 = letterList.substring(3)

    setGameLetters(t1 + gameLetters.charAt(3) + t2)
  }
  const [cursorShown, setCursorShow] = useState(0)
  const [intervalSet, setIntervalSet] = useState(false)
  useEffect(() => {
    if (!intervalSet) {
      setInterval(() => {
        setCursorShow(Math.floor(new Date() / 500) % 2 == 0 ? 1 : 0)
      }, 500)
      setIntervalSet(true)
    }
    document.body.addEventListener("keydown", keyPress, true)
  }, [])
  const requestWord = (d) => {
    if (isSendCooldownActive == true) return false

    setSendCooldownActive(true)
    setTimeout(() => {
      setSendCooldownActive(false)
    }, 800)
    var newLc = [...letterChain]
    if (d != null) newLc = d

    if (newLc.length < 4) {
      setOverStatus("TOO SHORT!")
      clearWord()
      playSound("wrong")
      setTimeout(() => {
        setOverStatus("")
      }, 2000)
      return
    }

    axios
      .post(
        import.meta.env["VITE_REACT_APP_API"] + "/sendWord",
        {
          word: newLc.join("").toLowerCase(),
        },
        {
          headers: {
            Authorization: getCookie("authToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.status === "use_central") {
          playSound("wrong")
          setShaking(true)

          setTimeout(function () {
            setOverStatus("Use central letter")
            clearWord()
            setShaking(false)
          }, 1000)

          setTimeout(function () {
            setOverStatus("")
          }, 2000)
        } else if (response.data.status === "already_found") {
          playSound("wrong")
          setShaking(true)

          setTimeout(function () {
            setOverStatus("Word already found")
            setShaking("")
            clearWord()
          }, 1000)

          setTimeout(function () {
            setOverStatus("")
          }, 2000)
        } else if (response.data.status === "not_found") {
          playSound("wrong")
          setShaking(true)

          setTimeout(function () {
            setOverStatus("Word not found")
            clearWord()
            setShaking(false)
          }, 1000)

          setTimeout(function () {
            setOverStatus("")
          }, 3000)
        } else if (response.data.status == "not_themed") {
          setFloaterStatus("shown")
          setTimeout(() => {
            setFloaterStatus("shown go")
          }, 50)
          setTimeout(() => {
            setFloaterStatus("")
          }, 2500)
          playSound("correct")
          setOverStatus("+ " + getWordByLetters().length + " POINTS!")
          clearWord()
          setTimeout(function () {
            setOverStatus("")
          }, 2000)
        } else if (response.data.status == "themed") {
          setFloaterStatus("shown")
          setTimeout(() => {
            setFloaterStatus("shown go")
          }, 50)
          setTimeout(() => {
            setFloaterStatus("")
          }, 2500)
          var romElem = document.querySelector(".game-block__field")

          playSound("bonus")
          setOverStatus("+ " + (getWordByLetters().length + 10) + " POINTS!")
          setTimeout(function () {
            setOverStatus("")
            clearWord()
          }, 2000)
        }
      })
      .finally(() => {})
  }
  const [movingScore, setMovingScore] = useState(false)
  const [gameLetters, setGameLetters] = useAtom(gameLettersAtom)
  const letterContainerRef = useRef()
  const HexBlock = React.memo((props) => {
    console.log("re hex")
    return (
      <div className="hex">
        <div className="hexIn">
          <div className="hexLink">
            <p>B</p>
          </div>
        </div>
      </div>
    )
  })

  const MiddleHexBlock = React.memo((props) => {
    return (
      <div className="hex middle">
        <div className="hexIn">
          <div className="hexLink">
            <p>A</p>
          </div>
        </div>
      </div>
    )
  }, true)
  function fillLetter(letter) {
    if (shaking) return
    playSound("letter")

    setLetterChain([...letterChain, letter])
    setLastFullWord([...letterChain, letter])
  }
  useEffect(() => {
    if (letterChain.length == 0) {
      setStatus("")
    } else {
      setStatus(getWordByLetters())
      setOverStatus("")
    }
  }, [letterChain])

  function createAnimationPart(letter, x, y) {
    if (document.body.offsetWidth <= 400) {
      x += 40
    }

    var elem = document.createElement("span")
    elem.textContent = "+1"
    elem.style.top = y + "px"
    elem.style.left = x + "px"
    var elemBottom = document.createElement("span")
    elemBottom.textContent = letter
    elemBottom.style.top = y + "px"
    elemBottom.style.left = x + "px"
    document.querySelector(".game-block__field__animation").appendChild(elem)
    document.querySelector(".game-block__field__animation").appendChild(elemBottom)
    setTimeout(function () {
      elemBottom.classList.add("movingBottom")
    }, 100)
    setTimeout(function () {
      elemBottom.remove()
    }, 1600)
    setTimeout(function () {
      elem.classList.add("movingTop")
    }, 100)
    setTimeout(function () {
      elem.remove()
    }, 1600)
  }
  const handleHexTouchStart = (e) => {
    var rect = e.target.getBoundingClientRect(),
      offsetX = e.touches[0].clientX - rect.left,
      offsetY = e.touches[0].clientY - rect.top

    if (offsetY > 50 || offsetY < 0) {
      if (offsetY > 50) offsetY -= 50
      if (isDiffAllowed(offsetY, offsetX)) e.target.classList.add("active")
    } else {
      e.target.classList.add("active")
    }
  }
  const handleHexTouchEnd = (e, char) => {
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active")
      fillLetter(char)
    }
  }
  const handleTouchMove = (e) => {
    if (document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)?.nodeName !== "NAV") {
      e.touches[0].target.classList.remove("active")
    }
  }
  const handleHexMouseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleHexMouseDown = (e) => {
    if (isTouchDevice()) return

    var rect = e.currentTarget.getBoundingClientRect(),
      offsetX = e.clientX - rect.left,
      offsetY = e.clientY - rect.top

    if (offsetY > 50 || offsetY < 0) {
      if (offsetY > 50) offsetY -= 50
      if (isDiffAllowed(offsetY, offsetX)) {
        if (document.querySelector("nav.active")) document.querySelector("nav.active").classList.remove("active")
        e.currentTarget.classList.add("active")
      }
    } else {
      e.currentTarget.classList.add("active")
    }
  }
  const handleHexMouseUp = (e, char) => {
    if (isTouchDevice()) return
    if (e.currentTarget.classList.contains("active")) {
      e.currentTarget.classList.remove("active")
      fillLetter(char)
    }
  }
  const handleHexMouseOut = (e) => {
    if (isTouchDevice()) return
    e.target?.classList.remove("active")
  }
  const isDiffAllowed = (diff, x) => {
    x = Math.max(45, x) - Math.min(45, x)
    diff = Math.abs(diff)

    var percentage = (45 - x) / 45
    var maxDiff = 28 * percentage

    return diff <= maxDiff
  }
  const getWordByLetters = () => {
    var lc = letterChain
    if (letterChain.length == 0) {
      lc = JSON.parse(document.querySelector(".game-block__hex").getAttribute("data-letters"))
    }
    var ret = ""
    for (var i = 0; i < lc.length; i++) {
      ret += lc[i]
    }
    return ret
  }
  const clearWord = () => {
    setLetterChain([])

    while (document.querySelector(".game-block__field .sel")) {
      document.querySelector(".game-block__field .sel").className = ""
    }
  }

  const getSecondsText = () => {
    if (secondsBefore == 1) return "SECOND"
    return "SECONDS"
  }
  const generateSelColor = () => {
    return "#649EF8"
  }
  const [active, setActive] = useState(false)
  const [secondsBefore, setSecondsBefore] = useAtom(secondsBeforeAtom)
  const [seconds, setSeconds] = useAtom(secondsAtom)
  const [words, setWords] = useAtom(guessedWordsAtom)
  /*
     {
            word: 'Word',
            team: 'blue',
            isTheme: true
        }
 */
  const [gameTheme, setGameTheme] = useAtom(gameThemeAtom)

  const [status, setStatus] = useState("GUESS THE WORDS!")
  const [overStatus, setOverStatus] = useState("")

  const [wordLetters, setWordLetters] = useState([])
  const [firstPlayerName, setFirstPlayerName] = useAtom(firstPlayerAtom)
  const [secondPlayerName, setSecondPlayerName] = useAtom(secondPlayerAtom)
  const [blueScore, setBlueScore] = useAtom(blueScoreAtom)
  const [redScore, setRedScore] = useAtom(redScoreAtom)
  useEffect(() => {
    if (blueScore == 0 && redScore == 0) return
    setMovingScore(true)
    setTimeout(function () {
      setMovingScore(false)
    }, 1300)
  }, [blueScore, redScore])
  const getCookie = (name) => {
    var nameEQ = name + "="
    var ca = document.cookie.split(";")
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const convertSeconds = () => {
    var sec = Math.floor(seconds % 60)
    if (sec < 10) {
      sec = "0" + sec
    }
    return Math.floor(seconds / 60) + ":" + sec
  }

  useEffect(() => {
    if (active) {
      if (seconds === 0) {
      } else
        setTimeout(function () {
          setSeconds(gameEndTime - Math.floor(new Date() / 1000))
        }, 1000)
    }
  }, [seconds, active])
  useEffect(() => {
    if (secondsBefore == 0) {
      setActive(true)
    } else
      setTimeout(() => {
        setSecondsBefore((secondsBefore) => secondsBefore - 1)
      }, 1000)
  }, [secondsBefore])
  useEffect(() => {
    /*setTimeout(function(){setSecondsBefore(2)},1000);
setTimeout(function(){ setSecondsBefore(1)},2000);
setTimeout(function(){
    setSecondsBefore(0)
    setActive(true);


},3000);*/
  }, [])
  return (
    <>
      {secondsBefore > 0 && (
        <div className="game-overlay">
          <p>
            THE GAME WILL START IN {secondsBefore} {getSecondsText()}
            <br /> GET READY!
          </p>
        </div>
      )}
      <div className="game-block" onClick={(e)=>e.stopPropagation()}>
        <div className="game-block__header">
          <div className="player1 player">
            <div>
              <p>{firstPlayerName.charAt(0).toUpperCase()}</p>
            </div>
            <p>{firstPlayerName}</p>
          </div>
          <div className="timer">
            <p>{seconds > 0 && convertSeconds(seconds)}</p>
          </div>
          <div className="player2 player">
            <p>{secondPlayerName}</p>
            <div>
              <p>{secondPlayerName.charAt(0).toUpperCase()}</p>
            </div>
          </div>
        </div>
        <div className="game-block__topic">
          <div className="gameScore">
            <div
              style={{
                width: (blueScore > 0 || redScore > 0 ? Math.min(85, Math.max(15, (blueScore / (blueScore + redScore)) * 100)) : 50) + "%",
              }}
              className="blue"
            >
              <p>{blueScore}</p>
              <img src={flash} alt="" className={movingScore ? "flash moving " : "flash"} />
            </div>

            <div
              style={{
                width: (blueScore > 0 || redScore > 0 ? Math.min(85, Math.max(15, (redScore / (blueScore + redScore)) * 100)) : 50) + "%",
              }}
              className="red"
            >
              <p>{redScore}</p>
            </div>
          </div>
        </div>

        <div className="game-block__input">
          <nav className={"floater " + floaterStatus}>
            <div className="floater__item1">{lastFullWord.map((elem) => (elem == gameLetters.charAt(3) ? <b> {elem} </b> : elem))}</div>
            <div className="floater__item2">{lastFullWord.map((elem) => (elem == gameLetters.charAt(3) ? <b> {elem} </b> : elem))}</div>
          </nav>
          <p className={shaking ? "shaking" : ""}> {overStatus !== "" ? <span> {overStatus} </span> : letterChain.map((elem) => (elem == gameLetters.charAt(3) ? <b> {elem} </b> : elem))} </p>

          <div style={{ opacity: overStatus !== "" ? 0 : cursorShown }}></div>
        </div>
        <div className="game-block__hex" data-avail={gameLetters} data-letters={JSON.stringify(letterChain)}>
          <div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(0))
                  }}
                >
                  <p>{gameLetters.charAt(0)}</p>
                </div>
              </div>
            </div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(1))
                  }}
                >
                  <p>{gameLetters.charAt(1)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(2))
                  }}
                >
                  <p>{gameLetters.charAt(2)}</p>
                </div>
              </div>
            </div>
            <div className="hex middle">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(3))
                  }}
                >
                  <p>{gameLetters.charAt(3)}</p>
                </div>
              </div>
            </div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(4))
                  }}
                >
                  <p>{gameLetters.charAt(4)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(5))
                  }}
                >
                  <p>{gameLetters.charAt(5)}</p>
                </div>
              </div>
            </div>
            <div className="hex">
              <div className="hexIn">
                <div
                  className="hexLink"
                  onMouseDown={() => {
                    fillLetter(gameLetters.charAt(6))
                  }}
                >
                  <p>{gameLetters.charAt(6)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="game-block__buttons">
          <button
            onClick={() => {
              popLetter()
            }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              reroll()
            }}
          >
            <LuRefreshCw />
          </button>
          <button
            onClick={() => {
              requestWord(null)
            }}
          >
            Enter
          </button>
        </div>
        <div style={{ userSelect: "none" }} className="game-block__words">
          {words && words.length > 0 ? words.map((item) => <a className={item.team + (item.isTheme ? " theme" : "")}>{item.word.toUpperCase()}</a>) : "No words found yet"}
        </div>
      </div>
    </>
  )
}
/*
      <div
          className="game-block__hex"
          data-avail={gameLetters}
          data-letters={JSON.stringify(letterChain)}
        >
          <div>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(0))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(0));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(0)}</p>
            </nav>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(1))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(1));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(1)}</p>
            </nav>
          </div>
          <div>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(2))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(2));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(2)}</p>
            </nav>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(3))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(3));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(3)}</p>
            </nav>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(4))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(4));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(4)}</p>
            </nav>
          </div>
          <div>
            <nav
              onClick={handleHexMouseClick}
              onTouchMove={handleTouchMove}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(5))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(5));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(5)}</p>
            </nav>
            <nav
              onTouchMove={handleTouchMove}
              onClick={handleHexMouseClick}
              onTouchStart={handleHexTouchStart}
              onTouchEnd={(e) => handleHexTouchEnd(e, gameLetters.charAt(6))}
              onMouseDown={handleHexMouseDown}
              onMouseUp={(e) => {
                handleHexMouseUp(e, gameLetters.charAt(6));
              }}
              onMouseOut={handleHexMouseOut}
            >
              <p>{gameLetters.charAt(6)}</p>
            </nav> 
          </div>
        </div>
        */
