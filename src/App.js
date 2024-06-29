import React from "react";  
import BracketCreator from "./components/BracketCreator";
import BracketViewer from "./components/BracketViewer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Tournament Bracket</h1>
      </header>
      <main className="App-content">
        <BracketCreator />
        <BracketViewer />
      </main>
    </div>
  );
}

export default App;