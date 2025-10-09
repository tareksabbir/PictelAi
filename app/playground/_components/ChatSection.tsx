import { Messages } from "../[projectId]/page";
import ChatFooter from "./ChatFooter";

type Props = {
  messages: Messages[];
  onSend: any;
};

const ChatSection = ({ messages, onSend }: Props) => {
  return (
    <section className="w-96 shadow h-[95vh] p-4 flex flex-col">
      {/* Message Section  */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center">No messages yet</p>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-3/4 rounded-lg ${
                  message.role === "user"
                    ? "bg-black text-white "
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer section  */}
      <ChatFooter onSend={onSend} />
    </section>
  );
};

export default ChatSection;
