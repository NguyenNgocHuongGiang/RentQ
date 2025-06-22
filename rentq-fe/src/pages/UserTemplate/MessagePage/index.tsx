import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaFacebookMessenger, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  addNewMessage,
  deleteUserMessage,
  getPeopleMess,
  getUserMessage,
  updateReceiverLastMessage,
} from "../../../store/slice/messageSlice";
import { checkLogin, getAuthData } from "../../../utils/helpers";
import { MessageType, User } from "../../../types/types";
import { io } from "socket.io-client";

export default function MessagePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultHost = location.state || null;
  const dispatch = useDispatch<AppDispatch>();
  const { listMessages, listReceivers } = useSelector(
    (state: any) => state.messageReducer
  );
  const [selectedHost, setSelectedHost] = useState(defaultHost);
  const [input, setInput] = useState("");

  const socketRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const userId = getAuthData()?.userId;

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080", {
        query: { userId },
      });

      socketRef.current.emit("joinRoom", { userId });
    }

    checkLogin(navigate);
    fetchData();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [listMessages]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: MessageType) => {
      if (newMessage.sender_id !== userId) {
        dispatch(addNewMessage(newMessage));
      }

      // dispatch(addNewMessage(newMessage));
      dispatch(
        updateReceiverLastMessage({
          sender_id: newMessage.sender_id,
          receiver_id: newMessage.receiver_id,
          content: newMessage.content,
          sent_at: new Date().toISOString(),
        })
      );
    };

    if (socketRef.current) {
      socketRef.current.on("receiveMessage", handleReceiveMessage);
    }

    return () => {
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedHost]);

  useEffect(() => {
    if (defaultHost && listReceivers.length > 0) {
      const matched = listReceivers.find(
        (receiver: any) => receiver.user_id === defaultHost.id
      );
      if (!selectedHost && matched) {
        setSelectedHost(matched);
      }
    }
  }, [defaultHost, listReceivers]);

  const fetchData = async () => {
    try {
      const userId = getAuthData()?.userId;
      await dispatch(getPeopleMess(userId)).unwrap();

      if (defaultHost) {
        await dispatch(
          getUserMessage({
            senderId: userId,
            receiverId: defaultHost?.id,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Lỗi khi fetch message: ", error);
    }
  };

  const handleSelectContact = (contact: any) => {
    setSelectedHost(contact);

    dispatch(
      getUserMessage({
        senderId: getAuthData()?.userId,
        receiverId: contact.user_id ?? 0,
      })
    ).unwrap();
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const message: MessageType = {
      sender_id: getAuthData()?.userId,
      receiver_id: selectedHost?.user_id,
      content: input,
    };
     dispatch(addNewMessage(message));
    socketRef.current?.emit("sendMessage", message);
    setInput("");
  };

  const handleDeleteMess = (contact: User) => async () => {
    await dispatch(
      deleteUserMessage({
        senderId: getAuthData()?.userId,
        receiverId: contact.user_id ?? 0,
      })
    ).unwrap();
    setSelectedHost(null);
  };

  return (
    <div className="flex h-150 max-w-7xl mx-auto my-5 border bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-center text-xl font-bold mb-4">Conversations</h2>

        {[...listReceivers]
          .sort((a, b) => {
            const timeA = new Date(a.last_message?.sent_at || 0).getTime();
            const timeB = new Date(b.last_message?.sent_at || 0).getTime();
            return timeB - timeA;
          })
          .map((contact: any) => (
            <div
              key={contact.user_id}
              onClick={() => handleSelectContact(contact)}
              className={`flex items-center gap-3 p-3 my-2 rounded-lg hover:bg-gray-200 cursor-pointer ${
                selectedHost?.user_id === contact.user_id ? "bg-gray-300" : ""
              }`}
            >
              <img
                src={contact?.avatar_url || "https://i.pravatar.cc/40"}
                alt={contact?.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col flex-1">
                <span className="font-medium text-gray-800">
                  {contact?.full_name}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {contact.last_message?.content.length > 35
                    ? contact.last_message?.content.slice(0, 35) + "..."
                    : contact.last_message?.content}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Chat window */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        {selectedHost ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-white shadow-sm">
            {/* Bên trái: Avatar + Info */}
            <div className="flex items-center gap-3">
              <img
                src={selectedHost.avatar_url || "https://i.pravatar.cc/40"}
                alt={selectedHost.full_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  {selectedHost.full_name}
                </div>
                <div className="text-sm text-gray-500">Online</div>
              </div>
            </div>

            {/* Bên phải: Nút Delete */}
            <button
              onClick={handleDeleteMess(selectedHost)}
              className="transision duration-150 hover:text-red-500 text-sm font-medium cursor-pointer"
            >
              <FaTrashAlt size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col p-4 text-center h-150">
            <FaFacebookMessenger className="text-6xl text-gray-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-600">Your Messages</h2>
            <p className="text-sm text-gray-400">
              Send photos and private messages to your friends or groups
            </p>
          </div>
        )}

        {/* Chat messages */}
        {selectedHost && (
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2 bg-white"
          >
            {listMessages.map((msg: MessageType, index: number) => (
              <div
                key={index}
                className={`max-w-fit px-3 py-2 rounded-lg ${
                  msg.sender_id === getAuthData()?.userId
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        {selectedHost && (
          <div className="p-4 flex items-center bg-white gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && selectedHost) handleSend();
              }}
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
