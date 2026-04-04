import React from 'react'
import "../styles/home.scss"

const Home = () => {
  return (
    <div>
        <main className='home'> 
          
           <div className="left">
              <textarea name="job-description" id="job-description" placeholder='Enter job description here....'></textarea>
           </div>

           <div className="right">
              <div className="input-group">
                  <label htmlFor="resume">Upload resume</label>
                  <input type="file" name='resume' id='resume' accept='pdf'/>
              </div>

              <div className="input-group">
                  <label htmlFor="selfDescription">Self Desciption</label>
                  <textarea name="selfDescription" id="selfDescription"></textarea>
              </div>

              <button className='generate-btn'>Generate Interview Report</button>
           </div>
        </main>
    </div>
  )
}

export default Home
