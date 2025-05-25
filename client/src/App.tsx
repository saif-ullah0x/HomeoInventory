import { Route } from "wouter";
import LearningPage from "./pages/learning-integrated"; // Import the improved version

export default function App() {
  return (
    <div className="min-h-screen">
      <Route path="/" component={LearningPage} />
    </div>
  );
}