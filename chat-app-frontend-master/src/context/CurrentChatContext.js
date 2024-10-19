import React, { createContext, useContext, useState } from "react";

const currentChatContext = createContext();
export default function CurrentChatProvider({ children }) {
  const [currentChat, setCurrentChat] = useState("");
  const [selected, setSelected] = useState(false);
  const [selectedIndex,setSelectedIndex]=useState('')
  const changeChat= (data)=>{
    setCurrentChat(data)
  }
  return (
    <currentChatContext.Provider value={{ currentChat, changeChat,setSelected,selected ,selectedIndex,setSelectedIndex}}>
      {children}
    </currentChatContext.Provider>
  );
}
export const useCurrentChatContext = () => useContext(currentChatContext);
