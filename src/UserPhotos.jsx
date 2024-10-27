import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
const fetchUsersData=async(name,per_page=50,page=2)=>{
    const response=await axios.get(`https://api.unsplash.com/users/${name}/photos?client_id=65nrgCZc9Y1c7fYQwH4NasdAPVFXjdcO8jJs6K73_rs&per_page=${per_page}&page=${page}`)
    const result=await response.data
    console.log(result)
    return result
}


function UserPhotos() {
    const {username}=useParams();
    const nav=useNavigate();
    const{data, error, isLoading }=useQuery(["usersdata",username],()=>fetchUsersData(username))
    console.log("the data is",isLoading)
    console.log("the data is",data)
    if(isLoading) return <div>loading...</div>
    if(error) return <div>{error.message}</div>
    const seePhoto=(id)=>{
        nav('/')
      nav(`photo/${id}`);
    };
  
  return (
    <div className='flex flex-wrap flex-row gap-2'>
     {
        data.map((res,index)=>
        <div key={index}>
            <LazyLoadImage 
            src={res.urls.small_s3}
            effect='blur'
            className='w-48 h-24 cursor-pointer'
            onClick={()=>seePhoto(res.id)}
            />
        </div>
        )
     }
    </div>
  )
}

export default UserPhotos
