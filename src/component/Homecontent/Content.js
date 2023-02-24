
import './content.css'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'


// import img from '../../static/image/background.jpg'

export default function Content() {
  useEffect(()=>{
    axios.post('http://localhost:8000/loadmodel')
    .then(res => console.log("model loaded "))
    .catch(err => console.log(err))
  },[])
  return (
    <div className='content'>
        <div className='img'>
             {/* <img  className ="img"src= {img} alt="" /> */}
         
        </div>    
        <h1 class="project-title text-center mt-3">स्वर-सारांश</h1>
        <h4 class="project-title text-center mt-3">Automatic Nepali Speech Recognition and Summary</h4>
            
        <div class="container1">
            <p class="about">
            This is our major project on speech Recognition and summary. We have used the speech recognition API to convert the audio 
            file into text. We have also used the text summarization API to summarize the text. 
            We have used the ReactJS framework to build the front end of the website. The website is also responsive and can be used on 
            mobile devices as well.
            <br/>
            For speech recognition, we have used wav2vec 2.0 model (facebook/wav2vec2-large-xlsr-53). The model is finetuned on the openslr dataset.
            Similarly, for text summarization, we have used Extractive Summary using textRank Algorithm. Another model for speech to text is CNN-Resner-BiLSTM.
            
            </p>
        </div>
        <div class="content ">
        <div class="text-center">
            {/* <button class="button-three">Speech Recognition</button>
            <button class="button-three">Summary</button> */}
            <Link className='linkof' to='/sr'><button class="button-three">Speech Recognition</button></Link>
            
            <Link className='linkof' to='/summary'><button class="button-three">Summary</button></Link>
            
        </div>
        <br/>
        
        
        </div>
        <h1 class="project-title text-center mt-3">Motivation</h1>
        
        <div class="container1">
            <p class="about">
              By developing an automatic Nepali speech recognition and summarization
              project, we can help address this need and provide a valuable tool for individ-
              uals, businesses, and organizations that rely on Nepali language communication.
              The project has the potential to greatly enhance access to information, improve
              language learning, and facilitate more efficient and effective communication in
              Nepali.
              Furthermore, the project can have a significant impact on Nepali society, par-
              ticularly in education and healthcare. With accurate speech recognition and
              summarization technology, teachers can easily transcribe and summarize lectures,
              making them accessible to students who may have missed classes or have difficulty
              understanding spoken Nepali. In the healthcare sector, doctors and medical pro-
              fessionals can use technology to transcribe patient consultations and summarize
              medical records, improving patient care and medical research.
              Overall, the development of an automatic Nepali speech recognition and sum-
              marization project is a worthwhile endeavor that has the potential to improve
              communication, enhance access to information, and have a positive impact on
              Nepali society.
            </p>
        </div>
        <h1 class="project-title text-center mt-3">Model Details and Visualiztion</h1>

    </div>
  )
}
