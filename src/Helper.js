import bonusSound from "./versus-assets/bonus.mp3";
import correctSound from "./versus-assets/correct.mp3";
import selectSound from "./versus-assets/letter.mp3";
import wrongSound from "./versus-assets/wrong.mp3";
import drawSound from "./versus-assets/draw.mp3";
import lossSound from "./versus-assets/loss.mp3";
import winSound from "./versus-assets/win.mp3";
import { Howl } from "howler";
export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
export const openShareLink = (link, title, msg, to) => {
  if (to === "facebook")
    window.open(`https://www.facebook.com/share.php?u=${link}`, "_blank");
  if (to === "twitter")
    window.open(
      `http://x.com/share?url=${link}&text=${msg}&hashtags={}`,
      "_blank"
    );
  if (to === "reddit")
    window.open(
      `http://reddit.com/submit?url=${link}&title=${title}`,
      "_blank"
    );
  if (to === "whatsapp")
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  if (to === "pinterest")
    window.open(
      `https://ru.pinterest.com/pin/create/button/?description=${msg}&url=${link}`,
      "_blank"
    );
  if (to === "snapchat")
    window.open(
      `https://www.snapchat.com/scan?attachmentUrl=${link}`,
      "_blank"
    );
};
export const playSound = (name) => {
  if (localStorage.getItem("sound") == "true") {
   
    var audioArray = [];
    audioArray["bonus"] = bonusSound;
    audioArray["win"] = winSound;
    audioArray["loss"] = lossSound;
    audioArray["correct"] = correctSound;
    audioArray["draw"] = drawSound;
    audioArray["wrong"] = wrongSound;
    audioArray["letter"] = selectSound;

    const sound = new Howl({ src: audioArray[name] });
    
    sound.play();
  }
};

export function copyToClipboard(string) {
  let textarea;
  let result;

  try {
    textarea = document.createElement("textarea");
    textarea.setAttribute("readonly", true);
    textarea.setAttribute("contenteditable", true);
    textarea.style.position = "fixed"; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand("copy");
  } catch (err) {
  
    result = null;
  } finally {
    document.body.removeChild(textarea);
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const copyHotkey = isMac ? "⌘C" : "CTRL+C";
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}
