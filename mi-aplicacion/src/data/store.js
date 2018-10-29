import actionTypes from './actionTypes';
import dispatcher from './dispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';
import App from '../App';
//import _ from 'underscore';

const CHANGE_EVENT = 'change';

let AppData = {
    data:{
        isAuthenticated: false,
        tries: {
            max: 3,
            count: 0
        },
        authenticationInfo: {
            code: null,
            id: null,
            name: null,
            type: null
        },
        
    },
    
    getUserLogin(action) {
        axios.get('http://localhost:8088/pt1.pt2/webapi/personal/getLogin', {
            params: {
                user: action.user,
                pass: action.pass
            }
        })
        .then(function (response) {
            if(response.data.infoLogin.code===0){
                AppData.data.tries.count++;
                AppData.data.isAuthenticated=false;
                AppData.data.authenticationInfo=response.data.infoLogin; 
                if(AppData.data.tries.count >= 3){
                    AppData.data.authenticationInfo.type="Has excedido el número de intentos permitidos"
                }
                AppStore.emitChange();                
            }else if(response.data.infoLogin.code===1){
                if(response.data.infoLogin.type === "recepcion" || response.data.infoLogin.type === "instructor"){
                    AppData.data.isAuthenticated=true;
                    AppData.data.authenticationInfo=response.data.infoLogin;
                    if (typeof(Storage) !== "undefined") {
                        localStorage.code = response.data.infoLogin.code;
                        localStorage.id = response.data.infoLogin.id;
                        localStorage.name = response.data.infoLogin.name;
                        localStorage.type = response.data.infoLogin.type;
                    } else {
                        console.log("Sorry! No Web Storage support..")
                    }
                    AppStore.emitChange();
                }else if(response.data.infoLogin.type === "asistente"){
                    AppData.data.isAuthenticated=false;
                    AppData.data.authenticationInfo=response.data.infoLogin;
                    AppData.data.authenticationInfo.code=0;
                    AppData.data.authenticationInfo.type="Tu usuario no cuenta con permisos para accesar";
                    AppStore.emitChange();
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    closeLogin(){
        localStorage.code = "";
        localStorage.id = "";
        localStorage.name = "";
        localStorage.type = "";
        AppData.data.isAuthenticated=false;
        AppData.data.authenticationInfo.code="";
        AppData.data.authenticationInfo.id="";
        AppData.data.authenticationInfo.name="";
        AppData.data.authenticationInfo.type="";
        AppData.data.students="";
        AppStore.emitChange();
    },
    changeValueCode(){
        AppData.data.authenticationInfo.code=-1;
        AppStore.emitChange();
    },    
}

let AppStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppStore = assign({}, AppStore, {
    getData: () => {
        return AppData.data;
    }
});

dispatcher.register((action) => {
    switch (action.type) {
    case actionTypes.CHANGEVALUE_CODE:
        AppData.changeValueCode();
        break;
    case actionTypes.CLOSE_LOGIN:
        AppData.closeLogin();
        break;    
    case actionTypes.GET_USERLOGIN:
        AppData.getUserLogin(action);
        break;    
    default: 
		// no op
    }
});
//module.exports = AppStore;
export default AppStore;