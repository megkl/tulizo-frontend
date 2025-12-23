import React from "react";
import VoiceAssistant from "./components/VoiceAssistant";
import Dashboard from "./components/Dashboard";

function App() {
  const USER_ID = "meg123"; // initialize the logged-in user ID

  return (
    <div>
      {/* <VoiceAssistant userId={USER_ID} /> */}
      <Dashboard userId={USER_ID} />
    </div>
  );
}

export default App;