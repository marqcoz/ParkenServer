import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';


class Header extends React.Component {
    
    render() {
		return (
			<div className='header'>
				
                <span>Head Parken</span>
				    
			</div>
		);
	}
  }
  export default withRouter(Header);