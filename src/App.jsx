import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import ArrowDownwardTwoToneIcon from '@mui/icons-material/ArrowDownwardTwoTone';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


const fetchPhotos = async (title = "tree") => {
  const response = await axios.get('https://api.unsplash.com/search/collections', {
    params: {
      page: 1,
      query: title,
      per_page: 100,
      client_id: '65nrgCZc9Y1c7fYQwH4NasdAPVFXjdcO8jJs6K73_rs', // Replace with your actual access key
    },
  });
  console.log(response.data);
  return response.data.results;
};

const App = () => {
  const [query, setQuery] = useState("tree");
  const[usersearch,setsearch]=useState();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(['photos', query], () => fetchPhotos(query));
  const [likes, setLikes] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('liked')) || [];
    
    setLikes(storedLikes);
  }, []);
  

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(likes));
  }, [likes]);

  const likePhoto = (id) => {
    if (!likes.includes(id)) {
      setLikes((prevLikes) => {
        const updatedLikes = [...prevLikes, id];
        localStorage.setItem('liked', JSON.stringify(updatedLikes));
        return updatedLikes;
      });
    }
  };
  const downloadImage=async(res)=>{
     const response=await axios.get(res);
     console.log(response)
     const result=await response.blob();
     const url=window.URL.createObjectURL(result)
     console.log(url)
  }

  const click = (id) => {
    nav(`photo/${id}`);
  };

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    queryClient.invalidateQueries(['photos', newQuery]);
  };
const search=()=>{
  setQuery(usersearch)
   
}
  if (isLoading) return <div className='loader'></div>;
  if (error) return <p>Error fetching photos: {error.message}</p>;

  return (
    <div>
      <div className='flex flex-wrap gap-2'>
        <button onClick={() => handleQueryChange("animals")} className='bg-black rounded-lg text-white'>Animals</button>
        <button onClick={() => handleQueryChange("nature")} className='bg-black rounded-lg text-white'>Nature</button>
        <button onClick={() => handleQueryChange("bikes")} className='bg-black rounded-lg text-white'>Bikes</button>
        
      </div>
      <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      
        '& > :not(style)': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete="on"
    >
      <TextField id="outlined-basic" label="search-photo" variant="outlined" value={usersearch} onChange={(e)=>setsearch(e.target.value)}/>
        <button onClick={search}>search</button>
    </Box>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px' }}>
        {data.map((collection) => (
          <div key={collection.id} style={{ width: '140px', marginBottom: '10px', cursor: "pointer" }}>
            <LazyLoadImage
              src={collection.cover_photo.urls.small}
              alt={collection.title}
               className='w-52 h-20'
              style={{ borderRadius: "8px" }}
              onClick={() => click(collection.cover_photo.id)}
              effect='blur'
            />
            <div style={{ display: "flex" }}>
              <div>
                <button
                  onClick={() => likePhoto(collection.cover_photo.id)}
                  style={likes.includes(collection.cover_photo.id) ? { color: 'red' } : {}}
                >
                  <FavoriteBorderTwoToneIcon />
                </button>
                <a
                   href={collection.cover_photo.urls.full}
                  onClick={()=>downloadImage(collection.cover_photo.urls.full)}
                >
                  <ArrowDownwardTwoToneIcon />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
