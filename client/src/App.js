import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";
//Redux
import { Provider } from "react-redux"; //Connects react and redux
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

//Copyied it from action/auth.js because this was going to run only when the
//first time user loads
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
//useEffect imported because to use loadUser function
//"function App()" change this to arrow function
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); //adding [] will make sure that this will only run once
  //unless put [] it will keep running.Gotcha thing that useState hook has

  return (
    //Wrap app with it.Now everything can access app level state
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            {/* switch can only have routes in it so we put alert in same 
        section but outside switch*/}
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />

              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />

              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
