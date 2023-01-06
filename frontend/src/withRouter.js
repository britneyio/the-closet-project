import { Component } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const withRouter = Component => props => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
        <Component
        {...props}
        router={{ location, navigate, params}}
        />
    );
};

export default withRouter;