var React = require('react');

class InputLogin extends React.Component {
    
    render() {
       return (
            <div className="inputLogin">
                <input className={this.props.store.authenticationInfo.code === 0 ? this.props.class + " wrong" : this.props.class} maxLength="15" type={this.props.type} placeholder={this.props.placeHolder} onChange={this.props.onChange} onFocus={this.props.onFocus}/>
                <span className={this.props.store.authenticationInfo.code === 0 ? "icon-cross wrong-inputs" : "icon-cross"}></span>
            </div>
       );
    }
  }
  export default InputLogin;