import React from 'react'
import BlockBox from "../misc/BlockBox"

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  return (
    <BlockBox
    height="100%"
    width="60%"
    minWidth="40rem"
    >
      ChatBox
    </BlockBox>
  )
}

export default ChatBox