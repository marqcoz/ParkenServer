import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';


class Footer extends React.Component {
    
    render() {
		return (
			<div className='footer'>
				
                <span>Footer</span>
				
			</div>
		);
	}
  }
  export default withRouter(Footer);