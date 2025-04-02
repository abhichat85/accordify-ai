
import React from "react";
import { MessageBubble, Message } from "../MessageBubble";

interface MessagesListProps {
  messages: Message[];
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages
}) => {
  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLatest={index === messages.length - 1}
        />
      ))}
    </>
  );
};
