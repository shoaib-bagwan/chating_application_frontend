import { useChat } from "./Context";
import Message from "./Message";
import User from "./User";

function Home() {
  const { openText } = useChat();

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ height: "100vh" }}>
        {/* 🧍 User List */}
        <div
          className={`col-12 col-md-4 border-end ${
            openText ? "d-none d-md-block" : "d-block"
          }`}
          style={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          <User />
        </div>

        {/* 💬 Message Area */}
        <div
          className={`col-12 col-md-8 ${
            openText ? "d-block" : "d-none d-md-block"
          }`}
          style={{
            height: "100vh",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Message />
        </div>
      </div>
    </div>
  );
}

export default Home;
