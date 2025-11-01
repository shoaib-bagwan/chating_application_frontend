import { createContext, useContext, useState } from "react";


const ChatContext=createContext();
export const ChatProvider=({children})=>{
    const apiUrl="https://chating-application-backend.onrender.com";
    const [openText,setOpenText]=useState(false);
      const [selectedUser, setSelectedUser] = useState(null); 
    return(
        <ChatContext.Provider value={{apiUrl,openText,setOpenText,selectedUser,setSelectedUser}}>
            {children}
        </ChatContext.Provider>
    )
}
export function useChat(){
    return useContext(ChatContext);
}