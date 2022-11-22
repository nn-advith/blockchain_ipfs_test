import React, { Component } from 'react';
import Identicon from 'identicon.js';


class Navbar extends Component {

  render() {
    return (

      <nav className="navbar navbar-expand-lg navbar-dark bg-warning text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0 text-dark"
          href='https://cataas.com/#/'
        >
          {/* <img src={box} width="30" height="30" className="align-top" alt="" /> */}
          <b >Digital Certification </b>
        </a>
  

        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
          <ul className="navbar-nav px-10 ml-auto">
            <li className="nav-item" style={{marginRight: '20px', cursor: 'pointer' }} onMouseDown={() => this.props.changePage(0)}>
              <div className="nav-link text-dark">Upload</div>
            </li>
            <li className="nav-item" style={{marginRight: '20px', cursor: 'pointer' }} onMouseDown={() => this.props.changePage(1)}>
              <div className="nav-link text-dark">Create & Upload</div>
            </li>
            <li className="nav-item" style={{marginRight: '20px', cursor: 'pointer' }} onMouseDown={() => this.props.changePage(2)}>
              <div className="nav-link text-dark">Verify</div>
            </li>

            <li className="nav-link" style={{backgroundColor: '#444', borderRadius: '5px'}}>
                  <small id="account" style={{marginRight: '10px' }}>
                    <a target="_blank"
                    alt=""
                    className='text-white'
                    rel="noopener noreferrer"
                    href={"https://etherscan.io/address/"+this.props.account}>
                      {this.props.account ? this.props.account.substring(0,6) : '0x0'}...{this.props.account ? this.props.account.substring(38,42) : '' }
                    </a>
                  </small>
                  {this.props.account
                  ? <img
                    alt=""
                    className='nl-2'
                    style={{borderRadius: '50%'}}
                    width='30'
                    height='30'
                    src={`data:image/png;base64, ${new Identicon(this.props.account, 30).toString()}`}/>
                    : <span></span>
                  }
            </li>
          </ul>
        </div>
</nav>





  
    );
  }
}

export default Navbar;