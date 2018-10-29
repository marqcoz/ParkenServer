/*
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
*/
import React, { Component } from 'react';
import AppStore from './data/store';
import Login from './components/login/main';
import Header from './components/header/main';
import Footer from  './components/footer/main';
import actions from './data/actions';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';

import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()


function getAppState() {
    return AppStore.getData();
}

const PrivateRoute = ({ component: Component, store: store, actions: actions}) => (
    <Route render={(props) => (
        localStorage.getItem("code") !== null && localStorage.getItem("code") === "1"
        ? <Component {...store} history={history} actions={actions}/>
        : <Redirect to='/login' />
    )} />
)

class App extends React.Component {
    constructor(props){
        super(props);        
    }
    
    render() {
        return (
            <Router>
                <div id='generalDiv'>
                    <Header />
                    <Switch>                        
                        <Route path='/login' render={(props) => <Login />} />                                                   
                    </Switch>
                    <Footer />
                </div>
            </Router>

        );
    }
}
export default App;
