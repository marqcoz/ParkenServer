import actionTypes from './actionTypes';
import dispatcher from './dispatcher';

const Actions = {    
    closeLogin() {
        dispatcher.dispatch({
            type: actionTypes.CLOSE_LOGIN
        });
    },
    changeValueCode() {
        dispatcher.dispatch({
            type: actionTypes.CHANGEVALUE_CODE
        });
    },
    getUserLogin(user, pass) {
        dispatcher.dispatch({
            type: actionTypes.GET_USERLOGIN,
            user,
            pass
        });
    },     
};
export default Actions;
