import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { push } from '@lagunovsky/redux-react-router';
import withRouter from "../withRouter";
// function that can wrap any component to determine if it is authenticated
    class AuthenticationComponent extends React.Component {
        constructor(props) {
            super(props);
            this.checkAuth();
        }
        componentDidUpdate(prevProps, prevState) {
            this.checkAuth();
        }
        
        checkAuth() {
            // if not authenticated then it is redirected
            if (!this.props.isAuthenticated) {
                const redirectAfterLogin = window.location.pathname;
                this.props.dispatch(push(`/`));
            }
        }
        // if authenticated then renders the component
        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true ? 
                     this.props.children : null}
                </div>
            )
        }
    }

    AuthenticationComponent.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    // checks isAuthenticated from the auth store
    const mapStateToProps = state => {
        return {
            isAuthenticated: state.auth.isAuthenticated,
            token: state.auth.token
        };
    };
export default  connect(mapStateToProps)(withRouter(AuthenticationComponent));
