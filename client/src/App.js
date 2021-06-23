import React from "react";
import "./App.css";
//import "./tailwind.output.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";
import ForgotPassword from "./pages/public/ForgotPassword"
import ResetPassword from "./pages/public/ResetPassword"
import AcceptInvite from "./pages/public/AcceptInvite"
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
            <Route path="/signin">
              <SignIn />
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
            <Route path="/forgot_password">
              <ForgotPassword />
            </Route>
            <Route path="/reset_password/:token" children={<ResetPassword />} />
            <Route path="/invite/:token" children={<AcceptInvite />} />
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
