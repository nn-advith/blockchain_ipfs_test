import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'


class Main extends Component {

  render() {
    return (
      <>
      <div className="container-fluid mt-5 ">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              
              <div className='card mb-3 p-3 mx-auto bg-dark' style={{maxWidth: '512px'}} id="main-form">
                <h3 className='text-white text-monospace bg-dark'><b>Upload document</b></h3>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.fileDescription.value
                  this.props.uploadFile(description)
                }}>
                    <div className='form-group'>
                      <br></br>
                      <input 
                      id="fileDescription"
                      type="text"
                      ref={(input) => {this.fileDescription = input}}
                      className="form-control text-monospace "
                      placeholder='Title/Description'
                      required />
                    </div>
                    <input type='file' onChange={this.props.captureFile} className='text-white text-monospace' style={{marginBottom: '20px'}}/>
                    <button type='submit' className='btn  mb-7  bg-success btn-block'><b>Upload</b></button>
                </form>
              </div> 

              <p>&nbsp;</p>
              <h5 className='text-left text-monospace text-dark' style={{marginLeft: '-40px'}}><b>Uploaded documents</b></h5>

              <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px', marginLeft: '-40px', marginBottom: '100px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-dark text-white">
                    <th scope="col" style={{ width: '10px'}}>id</th>
                    <th scope="col" style={{ width: '200px'}}>name</th>
                    <th scope="col" style={{ width: '230px'}}>description</th>
                    <th scope="col" style={{ width: '120px'}}>type</th>
                    <th scope="col" style={{ width: '90px'}}>size</th>
                    <th scope="col" style={{ width: '90px'}}>date</th>
                    <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                    <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                  </tr>
                </thead>
                { this.props.files.map((file, key) => {
                  if (file.uploader === this.props.account) {
                  return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                        <td>
                          <a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uploader.substring(0,10)}...
                          </a>
                         </td>
                        <td>
                          <a
                            href={"https://infura-ipfs.io/ipfs/" + file.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fileHash}
                          </a>
                        </td>
                      </tr>
                    </thead>
                  ) 
                }else{
                  return null
                }
                })}
              </table>

            </div>
          </main>
        </div>
      </div>
      </>
    );
              // }
  }
}

export default Main;