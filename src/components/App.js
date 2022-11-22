//import DStorage from '../abis/DStorage.json'
import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar'
import html2pdf from 'html2pdf.js';
import Verify from './Verify';
import Create from './Create';


//Declare IPFS
const ipfsClient = require("ipfs-http-client")
const projectId = process.env.REACT_APP_PID;
const projectSecret = process.env.REACT_APP_PKEY;


const auth ='Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', headers: {
  authorization: auth
} })


class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
   
  }


  //load web3. uses some deprecated things
  async loadWeb3() {
    //Setting up Web3
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Non-ethereum browser detected. Please switch")
    }
  }




  //get data already present in blockchain: files, account name etc
  async loadBlockchainData() {

    this.setState({loading: true})
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()

    for(var j =0; j <accounts.length ; j++) {
      this.setState({
        accounts: [...this.state.accounts, accounts[j]]
      })
    }
    this.setState({account: accounts[0]});
    

    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]

    if(networkData){
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({dstorage})

      const fileCount = await dstorage.methods.fileCount().call();

      this.setState({fileCount})

      for(var i = fileCount; i>=1; i--){
        const file = await dstorage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })

      }

    }
    else{
      window.alert('DStorage contract not deployed on sleccted network')
    }
    this.setState({loading: false})
  }



  // Get file from user
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    console.log(file)
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }

    
  }

  

  checkVal = () => {
    this.setState({vLoading: true})
    ipfs.add(this.state.buffer, (err, res) => {
      if(err) {
        console.log(err)
        return
      }
      if (this.state.vHash === res[0].hash) {
        this.setState({vOp: 'Verified'})
        document.getElementById("ver-cont").classList.remove('bg-dark')
        document.getElementById("ver-cont").classList.remove('bg-danger')
        document.getElementById("ver-cont").classList.add('bg-success')
        // console.log('Verf')
        
      }else{
        // console.log('none')
        this.setState({vOp: 'Altered document'})
        document.getElementById("ver-cont").classList.remove('bg-dark')
        document.getElementById("ver-cont").classList.remove('bg-success')
        document.getElementById("ver-cont").classList.add('bg-danger')
      }
      this.setState({vLoading: false})
    })
  }





  changePage = page => {
    this.setState({page: page, vOp: ''});
  }



  getHash = e => {
    e.preventDefault()
    this.setState({vHash: e.target.value})
  }





  //Upload File
  uploadFile = description => {
        this.setState({loading: true})
        console.log('Submitting to IPFS..')
        ipfs.add(this.state.buffer, (err, result) => {
          console.log('IPFS result', result)
  
          if(err){
            console.log(err)
            return
          }
  
          this.setState({loading: true})
  
          if(this.state.type === '' ){
            this.setState({type: 'none'})
          }
  
          this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({
              loading: false,
              type: null,
              name: null,
            })
            window.location.reload()
            // this.setState({})
          }).on('error', (e) => {
            window.alert('Error')
            this.setState({loading: false})
          })
  
        })

  }





  downloadFile = () => {
    var filename = 'file'+Math.random().toString().slice(2,10)
    var options = {
      margin: 1,
      filename: filename
    }

    var element = document.getElementById('certificate');
    html2pdf().set(options).from(element).save()
  }






  createAndUpload = description => {
    var filename = 'file'+Math.random().toString().slice(2,10)
    var options = {
      margin: 1,
      filename: filename
    }

    var element = document.getElementById('certificate');
    html2pdf().set(options).from(element).outputPdf().output('blob').then((data) => {
      try {
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(data)
        reader.onloadend = () => {
        this.setState({
          type: data.type,
          name: filename
        })
        var buf = Buffer.from(reader.result);
        console.log(buf)
        console.log('Submitting to IPFS..')
        ipfs.add(buf, (err, result) => {
          console.log('IPFS result', result)
  
          if(err){
            console.log(err)
            return
          }
  
          this.setState({loading: true})
  
          if(this.state.type === '' ){
            this.setState({type: 'none'})
          }
          console.log(result[0].hash, result[0].size, this.state.type, this.state.name, description)
  
          this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({
              loading: false,
              type: null,
              name: null,
            })
            window.location.reload()
            // this.setState({})
          }).on('error', (e) => {
            window.alert('Error')
            this.setState({loading: false})
          })
  
        })

        }
        
      }
      catch(e) {
        console.log('error herer', e)
      }

    }) 

  }

  

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      accounts: [], //gets the accounts connected to the web app
      account: '', //current account store
      dstorage: null, //i dont remember
      files: [], //files uploaded to Blockchain
      loading: true, //loading state
      type: null, //type of file in bufer
      name: null, // name of file in buffer
      page: 0, //for routing
      vHash: '', //hash for verifying
      vLoading: false, //verfication loading state
      vOp: '' //verification output
    }

  }

  render() {
    return (
        <>
       
      
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div> //simple loader
          : 
          
          <>
          {/* navbar */}
          <Navbar account={this.state.account} changePage={this.changePage}/> 

          {this.state.page === 0 ?

            <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
              account={this.state.account}
            />

          :
            //create
          this.state.page === 1 ?

          <Create 
            createAndUpload={this.createAndUpload}
            downloadFile={this.downloadFile}
          />

          :
            //verify
            <Verify 
            checkVal={this.checkVal} 
            getHash={this.getHash} 
            captureFile={this.captureFile} 
            vOp={this.state.vOp}
            vLoading={this.state.vLoading}  
            />
          
          
          }
           
          
            
          </> 
        }
        </>

    );
  }
}

export default App;