import { Messages } from "../[projectId]/page";
import ChatFooter from "./ChatFooter";

type Props = {
  messages: Messages[];
  onSend: (message: string) => void;
  loading: boolean;
};

const ChatSection = ({ messages, onSend, loading }: Props) => {
  return (
    <section className="w-96 h-[calc(100vh-80px)] flex flex-col shadow-md  overflow-hidden bg-white mt-3">
      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center">No messages yet</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 max-w-[75%] rounded-xl break-words ${
                  message.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center justify-center mt-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            <span className="ml-2 text-gray-900 text-sm">Thinking...</span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <ChatFooter onSend={onSend} />
    </section>
  );
};

export default ChatSection;

// import { Messages } from "../[projectId]/page";
// import ChatFooter from "./ChatFooter";

// type Props = {
//   messages: Messages[];
//   onSend: any;
//   loading: boolean;
// };

// const ChatSection = ({ messages, onSend, loading }: Props) => {
//   return (
//     <section className="w-96 shadow h-[95vh] p-4 flex flex-col">
//       {/* Message Section  */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
//         {messages.length === 0 ? (
//           <p className="text-muted-foreground text-center">No messages yet</p>
//         ) : (
//           messages.map((message, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`p-3 max-w-3/4 rounded-lg ${
//                   message.role === "user"
//                     ? "bg-black text-white "
//                     : "bg-gray-100"
//                 }`}
//               >
//                 <p className="text-sm">{message.content}</p>
//               </div>
//             </div>
//           ))
//         )}

//         <div>
//           {loading && (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
               
//               </div>
//               <span className="ml-2 text-gray-900">Thinking...</span>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Footer section  */}
//       <ChatFooter onSend={onSend} />
//     </section>
//   );
// };

// export default ChatSection;
