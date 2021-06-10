import React from "react";
import "./App.css";
//import "./tailwind.output.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import LogIn from "./pages/public/LogIn";
import SignUp from "./pages/public/SignUp";
import AuthenticatedApp from "./AuthenticatedApp";
import { useAuth } from "./lib/authHandler";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated === true && user && <AuthenticatedApp />}
      {isAuthenticated === false && (
        <Router>
          <Switch>
            <Route path="/login">
              <LogIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/features">
              <Features />
            </Route>
            <Route path="/pricing">
              <Pricing />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <LandingPage />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
};

export default App;
