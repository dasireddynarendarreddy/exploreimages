import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import './Users.css';
import { useNavigate } from 'react-router-dom';

const fetchPhotos = async (name) => {
  let data=name
  const result = await axios.get(`https://api.unsplash.com/search/users?page=1&query=${data}&per_page=40&client_id=65nrgCZc9Y1c7fYQwH4NasdAPVFXjdcO8jJs6K73_rs`);
  return result.data.results;
};

function Users() {
  const [name, setName] = useState("italy");
  const [submittedName, setSubmittedName] = useState(name);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  // Query data based on 'submittedName' only when refetch is called
  const { data = [], error, refetch } = useQuery(
    ['users', submittedName],
    () => fetchPhotos(submittedName),
    {
      refetchOnMount: false, 
    }
  );

  const viewTheUserPhotos = (username) => {
    const sanitizedUsername = username.replace(/\s/g, '');
    navigate(`/users/${sanitizedUsername}`);
  };

  const handleChange = (e) => {
    
    setName(e.target.value);
    
    
  };

  const getData = async () => {
    setIsFetching(true); // Start loader
    setSubmittedName(name); // Update the submitted name
    await refetch(); // Manually trigger the fetch with the current name
    setIsFetching(false); // Stop loader once fetching is complete
  };

  useEffect(() => {
    if (!isFetching) setIsFetching(false);
  }, [data, error]);

  if (isFetching) return <div className="loader"></div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className='w-fit'>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        className='border-2 border-black'
        placeholder='search-user-by-name'
      />
      <button onClick={getData}>SUBMIT</button>
    <div className='flex flex-row flex-wrap gap-2'>
      
      {
        data.map((res) => (
          <div key={res.id}>
            <div>
              <LazyLoadImage
                src={res.profile_image.large}
                effect="blur"
                style={{ width: "100px", height: "100px", borderRadius: "50%", border: "2px solid black" }}
              />
            </div>
            <div className='h-60 w-96'>
              <p className="font-extrabold">{res.first_name} {res.last_name}</p>
              <p>{res.bio}</p>
              {res.location && (
                <p><LocationOnIcon /> {res.location}</p>
              )}
              {res.social.instagram_username && (
                <p className='cursor-pointer hover:text-blue-500'>
                  <a target="_blank" href={`https://www.instagram.com/${res.social.instagram_username}`} rel="noopener noreferrer">
                    <InstagramIcon /> {res.social.instagram_username}
                  </a>
                </p>
              )}
              <button onClick={() => viewTheUserPhotos(res.first_name + res.last_name)}>
                View {res.first_name}'s photos
              </button>
            </div>
          </div>
        ))}
      
    </div>
    </div>
  );
}

export default Users;
