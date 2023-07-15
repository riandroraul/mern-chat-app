import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URI;
const ChatPage = () => {
  const [chats, setChats] = useState();
  const fetchChats = async () => {
    const res = await axios.get(`${apiUrl}/api/user/api/chat`);
    setChats(res);
  };

  console.log(chats);
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => {
        return (
          <ul>
            <li> {chat.chatName} </li>
          </ul>
        );
      })}
    </div>
  );
};

export default ChatPage;
