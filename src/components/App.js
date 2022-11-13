//import DStorage from '../abis/DStorage.json'
import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require("ipfs-http-client")
const projectId = process.env.REACT_APP_PID;
const projectSecret = process.env.REACT_APP_PKEY;


const auth ='Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', headers: {
  authorization: auth
} })


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

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

  async loadBlockchainData() {
    //Declare Web3
    const web3 = window.web3
    // console.log(web3)

    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]});
    // console.log(this.state.account)

    //Network ID
    const networkId = await web3.eth.net.getId()

    const networkData = DStorage.networks[networkId]


    if(networkData){
      // console.log(DStorage.abi)
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


  //Upload File
  uploadFile = description => {
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
            name: null
          })
          window.location.reload()

        }).on('error', (e) => {
          window.alert('Error')
          this.setState({loading: false})
        })

      })

  }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
    );
  }
}

export default App;