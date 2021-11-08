import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'


export const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    MODAL: "MODAL",
    LOGOUT: "LOGOUT"

}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        modal: false,
        errMessage: "",
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    modal: payload.modal
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modal: false
                })
            }

            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modal: false
                })
            }

            case AuthActionType.MODAL: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modal: payload.modal,
                    errMessage: payload.errMessage
                })
            }

            case AuthActionType.LOGOUT: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modal: false
                })
            }

            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn().catch(error => {
            console.log(error);
        });
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.loginUser = async function(userData, store){

        let errMes = "";
        const response = await api.loginUser(userData).catch(error=>{
            errMes = error.response.data.errorMessage;
        });
        console.log(errMes);
        if(response && response.status === 200){
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }else{
            authReducer({
                type: AuthActionType.MODAL,
                payload: {
                    modal: true,
                    errMessage: errMes
                }
            })
        }
        
        
    }

    auth.registerUser = async function(userData, store) {
        let errMes = "";
        const response = await api.registerUser(userData).catch(error => {
            errMes = error.response.data.errorMessage;
        });      
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            });
            history.push("/");
            store.loadIdNamePairs();
        }else{
            authReducer({
                type: AuthActionType.MODAL,
                payload: {
                    modal: true,
                    errMessage: errMes
                }
            })
        }
    }

    auth.closeModal = async function(){
        authReducer({
            type: AuthActionType.MODAL,
            payload: {
                modal: false
            }
        });
    }

    auth.logoutUser = async function(){
        let response = await api.logoutUser();
        authReducer({
            type: AuthActionType.LOGOUT,
            payload: {
            }
        });
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );

    
}

export default AuthContext;
export { AuthContextProvider };