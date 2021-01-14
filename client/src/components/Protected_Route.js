//https://medium.com/javascript-in-plain-english/how-to-set-up-protected-routes-in-your-react-application-a3254deda380
//code for protected route

import React from 'react'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = this.props.userId;
        let username = this.props.username;
       
        return isAuthenticated ? (
            //If homepage pass in username
            Component === Home_Page ?
            <Component username = {username} /> : <Component />
        ) : (
            <Redirect to={{ pathname: '/' }} />,
            console.log(isAuthenticated)
        );
    }
}

export default ProtectedRoute;