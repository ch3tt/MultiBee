import { Button, ConfigProvider, Dropdown, Select, Space } from "antd"
import { FaAngleDown } from "react-icons/fa6"
import { IoIosSettings } from "react-icons/io"
import { FaQuestion } from "react-icons/fa"
import { ImStatsBars2 } from "react-icons/im"
import { useAtom } from "jotai"
import { isDarkAtom, popupStateAtom } from "../pages/Home"

import question from "./../svg/question.svg"
import stats from "./../svg/stats.svg"
import settings from "./../svg/settings.svg"
import { FiSettings } from "react-icons/fi"
export default function Header() {
    const [popupState, setPopupState] = useAtom(popupStateAtom)
    return (
        <header className="header">
            <div className="header__container">
                <a className="logo" href="/">
                    <h5>Spelling Beat</h5>
                </a>
                <div className="header__right">
                    <Button
                        onClick={() => {
                            setPopupState("stats")
                        }}
                        icon={
                            <svg width={24} height={24}>
                                <path
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        }
                        size="middle"
                    />
                    <Button
                        onClick={() => {
                            setPopupState("settings")
                        }}
                        icon={<FiSettings size="22" />}
                        size="middle"
                    />
                    <Button
                        onClick={() => {
                            setPopupState("guide")
                        }}
                        icon={
                            <>
                                <img src={question} style={{ width: "24px", height: "24px" }} alt="" />
                            </>
                        }
                        size="middle"
                    />
                </div>
            </div>
        </header>
    )
}
