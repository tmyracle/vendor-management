import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Dashboard from "./pages/authenticated/Dashboard";
import { withToken } from "./lib/authHandler";

const AuthenticatedApp = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "/api/v1/user/is_authenticated",
          withToken()
        );
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard user={user} />
        </Route>
        <Route path="/*">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Router>
  );
};

export default AuthenticatedApp;
