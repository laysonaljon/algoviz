import { MdSort, MdSearch, MdMenu, MdOutlineWbSunny } from "react-icons/md";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle, IoMdMoon } from "react-icons/io";
import { GoGraph } from "react-icons/go";
import { FaGithub } from "react-icons/fa";

export const Icons = {
  MdSearch,
  MdSort,
  MdMenu,
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
  GoGraph,
  FaGithub,
  MdOutlineWbSunny,
  IoMdMoon
} as const;


export type IconKey = keyof typeof Icons;