import React from 'react';

class Verify extends React.Component {
    

    render() {
        return (
        <>
        <div className='container-fluid card text-monospace mt-5 p-3 bg-dark' style={{maxWidth: '700px'}} id="ver-cont">
        <h3 className='text-white'>Verify a document</h3>
        <div className='row p-3'>
            <input type='file' onChange={this.props.captureFile} className='text-white text-monospace' />
        </div>
        <div className='row p-3'>
            <input type='text' onChange={this.props.getHash} className='form-control text-dark text-monospace' placeholder='Enter the hash' required />
        </div> 
        <div className='row p-3'>
            <button onClick={this.props.checkVal} className="btn btn-light">Verify</button>
        </div>
        <div className='row p-3'>
        {this.props.vLoading ? <div className='text-white'>Loading...</div> :       <h2 className='text-white'>{this.props.vOp}</h2>}
      
        </div>
        </div>
        </>
        );
    }
}

export default Verify;