import { useState,useEffect } from 'react'
import './App.css'
import axios from "axios";

function App() {
    const [test,setTest] = useState("")
    useEffect(()=>{
        axios.get('/api/test')
            .then(res=>{
                console.log(res)
                setTest(res.data)
            })
    },[])
  return (
        <div>
            {test}
        </div>
      )
}

export default App
