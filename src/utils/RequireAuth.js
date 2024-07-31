import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router";
// function that can wrap any component to determine if it is authenticated

// checks isAuthenticated from the auth store

const selectAuth = state => state.auth;

export default function AuthenticationComponent(props)  {
    const {isAuthenticated}= useSelector(selectAuth);
    const navigate = useNavigate();


    useEffect(() => {
        checkAuth();
    })

        
        const checkAuth = () => {
            // if not authenticated then it is redirected
            if (!isAuthenticated) {
                navigate(`/`);
            }
        }
        // if authenticated then renders the component

            return (
                <div>
                    {isAuthenticated === true ?
                     props.children : null}
                </div>
            )

    }

