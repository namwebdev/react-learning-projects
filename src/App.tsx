import "./App.css";
import Column from "./components/Column";

function App() {
  return (
    <div className="main">
      <Column state="PLANNED" />
      <Column state="ONGOING" />
      <Column state="DONE" />
    </div>
  );
}

export default App;
