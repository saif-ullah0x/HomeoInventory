import { Route, Switch } from "wouter";
import LearningPage from "./pages/learning-integrated"; // Original version
import ImprovedLearningPage from "./pages/improved-learning"; // New improved version

export default function App() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/improved" component={ImprovedLearningPage} />
        <Route path="/" component={LearningPage} />
      </Switch>
    </div>
  );
}