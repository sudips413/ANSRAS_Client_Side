
import React from 'react';
import { ReactMic } from 'react-mic';
import AudioPlayer from "react-h5-audio-player";
import './mic.css';
import axios from 'axios';
import mic from '../../static/image/mic.jpg';




export default class Mics extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      wavFileblob: null,
      status:false,
      strokestate:false,
      selectedOption: "Wav2Vec",
      transcript:"",
      selectedOptionSummary: "Extractive",
    }
  }

  changeOption = (e) => {
    let value = document.getElementById("select").value;
    this.setState({selectedOption:value});
    // console.log(value);
  }
  changeOptionSummary = (e) => {
    let value = document.getElementById("selectsummary").value;
    this.setState({selectedOptionSummary:value});
    // console.log(value);
  }

  startRecording = () => {
    this.setState({ record: true });
    this.setState({status:false});
    this.setState({strokestate:true})
    document.getElementById("start-recording").style.display = "none";
    document.getElementById("stop-recording").style.display = "block";
  }

  stopRecording = () => {
    this.setState({ record: false });
    this.setState({status:true});
    this.setState({strokestate:false});
    document.getElementById("start-recording").style.display = "block";
    document.getElementById("stop-recording").style.display = "none";
  }

  // onData(recordedBlob) {
  //   console.log('chunk of real-time data is: ', recordedBlob);
  // }
  onStop = (blobObject) => {
    const { setAudioPath,wavFileblob } = this.props; // eslint-disable-line
    // console.info("onStop blobObject: ", blobObject);
    this.setState({
      blobURL: blobObject.blobURL,
      wavFileblob: blobObject.blob
    });
    blobObject.blobURL = new Date();
    // console.info("blobObject: ", blobObject);
    
    
    
  };
  // oncreate = (blobObject) => {
  //   this.setState

  // };
  Player = () => (
    this.state.status && <AudioPlayer autoPlay src={this.state.blobURL} onPlay={e => console.log("onPlay")} />  

  )
  render() {
      const {
        setAudioPath
      } = this.props;
      const handlesummary = async (e) => {
        e.preventDefault();
        let audiolength = this.state.transcript.split(" ").length
        if (audiolength > 10){
          document.getElementById("summarystatus").style.display = "block";

          let data = {
            texts: this.state.transcript
          }
          let input = JSON.stringify(data)
          let customConfig = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          console.log(this.selectedOptionSummary)
          this.state.selectedOptionSummary === "Extractive"? 
          await axios.post('http://tasr.eastus2.cloudapp.azure.com/input-text',input, customConfig)
          .then((res) => {
            this.setState({summary:res.data})
            document.getElementById("summary").style.display = "block";
            document.getElementById("showstatus").style.display = "none";
            document.getElementById("summarystatus").style.display = "none";
            
        })
        .catch((error) => {
          alert(" Server Error")
          console.log(error)
          document.getElementById("showstatus").style.display = "none";
          document.getElementById("summarystatus").style.display = "none";
        }) :
          await axios.post('http://tasr.eastus2.cloudapp.azure.com/abstract',input, customConfig)        
          .then((res) => {
            this.setState({summary:res.data})
            document.getElementById("summary").style.display = "block";
            document.getElementById("showstatus").style.display = "none";
            document.getElementById("summarystatus").style.display = "none";
            
        })
        .catch((error) => {
          alert(" Server Error")
          console.log(error)
          document.getElementById("showstatus").style.display = "none";
          document.getElementById("summarystatus").style.display = "none";
        })
      }
      else{
        alert("Please record audio more than 50 words")
        document.getElementById("showstatus").style.display = "none";
      }
      }  
      const test_wav2vec = async (e) =>{               
        //display the status and result
        document.getElementById("recordstatus").style.display = "none";
        document.getElementById("textsuccess").style.display = "none";
        document.getElementById("showstatus").style.display = "block";
        if (this.state.blobURL != null){
          //disbale the transcript btn
          document.getElementById("btn-transcript").disabled = true;
          document.getElementById("btn-transcript").style.cursor = "not-allowed";
          let blob = await fetch(this.state.blobURL).then(r => r.blob());
          // console.log("blob: ", blob);
          let wavFile = new File([blob], "audio.wav"); 
          // {type:this.state.wavFileblob.type});
          //   console.log(wavFile);
          const formData = new FormData()
          formData.append('audio', wavFile)
          
          await axios.post(      
            'http://tasr.eastus2.cloudapp.azure.com/audio_live', formData
            
          )
          .then((res)=> {
            document.getElementById("textsuccess").style.display = "block";
            document.getElementById("showstatus").style.display = "none";
            document.getElementById("summarystatus").style.display = "none";
            document.getElementById("textsuccess").innerHTML = res.data
            this.setState({transcript:res.data})
            console.log(this.state.transcript)
            document.getElementById("btn-transcript").disabled = false;
            document.getElementById("btn-transcript").style.cursor = "pointer";
        
          }  
          )
          .catch((error)=>{
            document.getElementById("btn-transcript").disabled = false;
            document.getElementById("btn-transcript").style.cursor = "pointer";
            document.getElementById("showstatus").style.display = "none";
            document.getElementById("no-response").innerHTML="No response from server"
          })
        }
        else{
          document.getElementById("recordstatus").style.display = "block";
          document.getElementById("showstatus").style.display = "none";
        }
      //disbale the transcript btn
      
          
     }
     const test_own = async (e) =>{
      document.getElementById("textsuccess").style.display = "none";
      document.getElementById("showstatus").style.display = "block";
      if (this.state.blobURL != null){
        let blob = await fetch(this.state.blobURL).then(r => r.blob());
        // console.log("blob: ", blob);
      
      
        let wavFile = new File([blob], "audio.wav"); 
        // {type:this.state.wavFileblob.type});
        //   console.log(wavFile);
        const formData = new FormData()
        formData.append('audio', wavFile)
        await axios.post(      
          'http://tasr.eastus2.cloudapp.azure.com/audio_live_own', formData
          
        )
        .then((res)=> {
          document.getElementById("showstatus").style.display = "none";
          document.getElementById("textsuccess").style.display = "block";
          document.getElementById("textsuccess").innerHTML = res.data
          this.setState({transcript:res.data})
          console.log(this.state.transcript)
          
        }  
        )
        .catch((error)=>{
          document.getElementById("showstatus").style.display = "none";
            document.getElementById("no-response").innerHTML="No response from server"
        })
      }
      else{
        alert("Please record audio first")
        document.getElementById("showstatus").style.display = "none";
      }
      
   }
     let strokeColor=this.state.strokestate ? "green" : undefined
    return (
      <div className='audio'>
        
          <center>       
            <div className='model-selection col-lg-6 col-sm-12 col-xs-12 col-md-8'>
              <span>Select the Model </span>
              <select id="select" onChange={this.changeOption} style={{width:"30%"}}>
                <option value="Wav2Vec">Wav2Vec</option>
                <option value="CNN-ResNet-BiLSTM">CNN-Resnet</option>
              </select>         
              <br/>
              <span>Current Model: {this.state.selectedOption}</span>
              </div>
          </center> 
        
        
        <img src={mic} alt="mic" className="mic mt-3" />
        <br/>
        <br/>
        <div className='audio__container'>
          
          <ReactMic
            onChange={this.onChange}
            record={this.state.record}
            className="sound-wave col"
            onStop={this.onStop}
            onData={this.onData}            
            strokeColor={strokeColor}
            strokeWidth={5}            
            backgroundColor="white" 
            setAudioPath={setAudioPath}
            mimeType="audio/wav"
            bitRate={256000}          // defaults -> 128000 (128kbps).  React-Mic-Gold only.
            sampleRate={96000}        // defaults -> 44100 (44.1 kHz).  It accepts values only in range: 22050 to 96000 (available in React-Mic-Gold)
            timeSlice={3000}
          />
          
          <br/>
          <br />
          {this.state.status &&
          <audio
            className='player col-xs-12 col-md-6 col-lg-6'
            ref="audioSource"
            controls="controls"
            src={this.state.blobURL}
          />
          } 
          <br/>
          <span id="start-recording" style={{color:"blue"}}>Click on start to start recording</span>
          <span id="stop-recording" style={{color:"blue",display:"none"}}>
            <div className='record-status'><div className='circle'></div><span id="recording"style={{marginTop:"4px"}}> Recording</span></div>
            Click on stop to stop recording
          </span>
          <br/>
          <button className='btn col-2' onClick={this.startRecording} type="button"><i className='fa fa-play' style={{paddingRight:"5px",color:"black"}}></i>Start</button>
          <button className='btn col-2' onClick={this.stopRecording} type="button"><i className='fa fa-stop' style={{paddingRight:"5px",color:"black"}}></i> Stop</button>
          
          {this.state.selectedOption === "Wav2Vec"?<button className='btn col-2' id="btn-transcript"onClick={test_wav2vec} type="button">Transcript- WV</button>:
          <button className='btn col-2' id="btn-transcript" onClick={test_own} type="button">Transcript- CNN</button>}
        </div>
        <br/>
        <span id="showstatus" style={{color:"green",display:"none"}}><i className="fa fa-info-circle" ></i> STT in Process...</span>
        <span id="recordstatus" style={{color:"red",display:"none"}}><i className="fa fa-exclamation-triangle" ></i> Please Record Audio</span>
        <span id="no-response" style={{color:'red'}}></span>
        
        <div className=" col">
            <div className=" col">
            <p id="textsuccess" style={{color:'palevioletred'}} className="contain col">
            </p>
            </div>
        </div>
        {this.state.transcript === ""? null :<>
        <center>       
          <div className='model-selection col-lg-6 col-sm-12 col-xs-12 col-md-8'>
            <span>Select Summary Method </span>
            <select id="selectsummary" onChange={this.changeOptionSummary} style={{width:"30%"}}>
              <option value="Extractive">Extractive</option>
              <option value="Abstractive">Abstractive</option>
            </select>         
            <br/>
            <span>Summary Method: {this.state.selectedOptionSummary}</span>
          </div>
        </center>
        <button id="sumbutton"className='btn col-2' onClick={handlesummary}> Summary </button></>}
        <span id="summarystatus" style={{color:"blue",display:"none"}}><i className="fa fa-info-circle" ></i> Summary in Process...</span>
        <br/>
        <center>
        <textarea  id="summary" style={{display:'none'}} className="col-lg-8 col-xs-8 col-md-8" value={this.state.summary}  disabled></textarea>
        </center>
      </div>

    );
  }
}
