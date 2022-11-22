import React from 'react';
import logo from '../assets/sample_logo.png';

class Create extends React.Component {
    constructor(props){
        super(props);
        this.state={
            action: 0,
            name:'',
            year:'',
            course: '',
            usn: '',
            branch:'',
            college: 'Ramaiah Institute of Technology',
            doi: '',
            rank: '',
            desc: ''

        }
    }

    render() {
        return <>
        {this.state.action === 0 ?

            <div className='container  text-monospace mt-5 p-3 form-certi'  style={{maxWidth: '900px'}}>
                {/* div 1 */}
                <h5 className='text-dark' style={{marginBottom: '40px'}}><b>Enter your details:</b></h5>

                    <p>College details</p>
                    <div className='card text-monospace p-3 ' style={{marginBottom: '40px'}}>
                        <label>College Name</label>
                        <input type='text' onChange={(e) => this.setState({college: e.target.value})} placeholder='College name'/>
                        <label>Year of Graduation</label>
                        <input type='number' onChange={(e) => this.setState({year: e.target.value})} placeholder='20xx' min={2022} max={2099}/>
                    </div>
                {/* div 2 */}
                    <p>Personal Details</p>
                    <div className='card text-monospace p-3' style={{marginBottom: '40px'}}>
                        <label>Full Name</label>
                        <input type='text' onChange={(e) => this.setState({name: e.target.value})} placeholder='Name'/>
                        <label>University Seat Number</label>
                        <input type='text' onChange={(e) => this.setState({usn: e.target.value})} placeholder='USN'/>
                        <label>Degree Classification</label>
                        <input type='text' onChange={(e) => this.setState({rank: e.target.value})} placeholder='Rank'/>
                        <label>Course</label>   
                        <input type='text' onChange={(e) => this.setState({coursse: e.target.value})} placeholder='Degree'/>
                        <label>Branch</label>
                        <input type='text' onChange={(e) => this.setState({branch: e.target.value})} placeholder='Branch'/>
                    </div>
                {/* div 3 */}
                    <div className='card text-monospace p-3' style={{marginBottom: '40px'}}>
                        <label>Date of Issue</label>
                        <input type='date' onChange={(e) => this.setState({doi: e.target.value.toString().split("-").reverse().join("-")})} placeholder='Date of Issue'/>
                    </div>
                <button className='btn  bg-success ' style={{maxWidth:'100px', marginBottom:'20px'}} onClick={() => {this.setState({action:1}); console.log(this.state)}}><b>Generate</b></button>
            </div>

            :
            <div className='container' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px'}}>

            <div id="certificate" className='certificate-wrapper'>
            <h5 style={{fontSize: '2.2rem', fontWeight: '700', marginBottom: '70px'}}>Sample Technological University, Place</h5>
            <img src={logo} alt="logo" style={{scale: '0.4', margin:'-90px', marginBottom: '-60px'}}/>
            <p><i>Certifies that</i></p>
            <h3 style={{fontWeight: '700'}}>{this.state.name}</h3>
            <p><i>has been admitted to the degree of</i></p>
            <h4 style={{fontWeight: '700'}}>{this.state.course}</h4>

            <p><i>in recognition of the fulfillment of the requirements </i></p>
            <p><i>for the said degree through.</i></p>

            <table style={{width: '100%', marginTop: '30px'}}>
                <thead>
                </thead>

                <tbody>
                    <tr>
                        <td>Name of the college</td>
                        <td>:</td>
                        <td style={{paddingLeft: '20px'}}>{this.state.college}</td>
                    </tr>
                    <tr>
                        <td>University Seat Number</td>
                        <td>:</td>
                        <td style={{paddingLeft: '20px'}}>{this.state.usn}</td>
                    </tr>
                    <tr>
                        <td>Branch</td>
                        <td>:</td>
                        <td style={{paddingLeft: '20px'}}>{this.state.branch}</td>
                    </tr>
                    <tr>
                        <td>Class</td>
                        <td>:</td>
                        <td style={{paddingLeft: '20px'}}>{this.state.rank}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{alignSelf: 'start', marginTop: '80px'}}>Place </div>
            <div style={{alignSelf: 'end'}}>Signature</div>
            
            <div style={{alignSelf: 'start'}}>Date of Issue: {this.state.doi}</div>


            </div>
            
            
            <div style={{ margin: '50px', width: '786px', display: 'flex'}}>
            <div style={{padding: '10px'}}>

            <button className='btn  mb-7  bg-success ' style={{maxWidth:'100px'}} onClick={() => this.props.downloadFile()}><b>Download</b></button>
            </div>
            <div style={{display: 'flex', marginLeft: '20px', backgroundColor: '#ddd', padding: '10px', borderRadius: '5px'}}>
                <input type='text' placeholder='Enter description' style={{width: '300px', padding: '2px'}} onChange={(e) => this.setState({desc: e.target.value})}/>
            <button className='btn  mb-7  bg-success ' style={{maxWidth:'150px', marginLeft: '10px'}} onClick={() => {this.props.createAndUpload(this.state.desc)}}><b>Upload</b></button>
            </div>
            </div>
            </div>
        }
            
        </>;
    }
}

export default Create;