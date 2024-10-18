import React from 'react'
import App from './App'
import Photo from './Photo'
import {BrowserRouter as Router,Routes as Routes2,Route, useParams} from "react-router-dom"
function Routes() {
 
  return (
    <div>
      <Router>
        <Routes2>
            <Route path="/" element={<App/>}/>
             <Route path={`photo/:id`} element={<Photo/>}/>
        </Routes2>
      </Router>
    </div>
  )
}

export default Routes
