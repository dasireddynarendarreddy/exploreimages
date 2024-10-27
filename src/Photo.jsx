import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import ArrowDownwardTwoToneIcon from '@mui/icons-material/ArrowDownwardTwoTone';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const getSomePhotos = async (title) => {
  const response = await axios.get('https://api.unsplash.com/search/collections', {
    params: {
      page: 1,
      query: title,
      per_page: 100,
      client_id: '65nrgCZc9Y1c7fYQwH4NasdAPVFXjdcO8jJs6K73_rs', // Replace with your actual access key
    },
  });
  return response.data.results;
};

function Photo() {
  const { id } = useParams(); // Get the photo ID from the URL parameters
  const [photoUrl, setPhotoUrl] = useState(''); // State to store the photo URL
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Initialize useNavigate
 const [liked, setliked] = useState([]);

  const fetchPhoto = async () => {
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
        params: {
          client_id: '65nrgCZc9Y1c7fYQwH4NasdAPVFXjdcO8jJs6K73_rs', // Replace with your Unsplash access key
        },
      });

      const relatedTitle = response.data.related_collections.results[0]?.title; // Safe navigation
      setPhotoUrl(response.data.urls.full); // Use the full-size image URL for better quality
      setLoading(false); // Set loading to false after fetching

      return relatedTitle;
    } catch (err) {
      setError(err.message); // Capture any error that occurs during fetch
      setLoading(false); // Set loading to false even if there's an error
      return null;
    }
  };
  const pushToLikes=(id)=>{
  
      if (!liked.includes(id)) {
        setliked((prevLikes) => {
          const updatedLikes = [...prevLikes, id];
          localStorage.setItem('/photos/liked', JSON.stringify(liked));
          return updatedLikes
        });
      }
    };
    useEffect(() => {
      localStorage.setItem('/photos/liked', JSON.stringify(liked));
    }, [liked]);
  
  
    useEffect(() => {
      const storedLikes = JSON.parse(localStorage.getItem('/photos/liked')) 
     
    setliked(storedLikes);
    }, []);
   

  const { data: collections, isError: isCollectionError, isLoading: isCollectionLoading } = useQuery(
    ['photos', id],
    async () => {
      const title = await fetchPhoto();
      if (title) {
        return getSomePhotos(title);
      }
      return [];
    },
    {
      enabled: !!id,
    }
  );

  const handlePhotoClick = (photoId) => {
    navigate(`/photo/${photoId}`, { replace: true });
  };

  if (loading || isCollectionLoading) return <div className='loader'></div>;
  if (error || isCollectionError) return <p>Error fetching photo: {error}</p>;

  return (
    <>
      <div style={{ margin: '20px 0', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <LazyLoadImage
          
            src={photoUrl}
            alt={`Photo ID: ${id}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            
          />
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "4px" }}>
        {collections.map((collection) => (
          <div key={collection.id} style={{ width: "100px", borderRadius: '8px',overflow:'hidden'}}>
            <LazyLoadImage
              src={collection.cover_photo.urls.small}
              alt={collection.title}
               className='w-52 h-20 cursor-pointer'
              style={{ borderRadius: "8px" }}
              onClick={() => handlePhotoClick(collection.cover_photo.id)}
              effect='blur'
            />

           
            <div style={{display:"grid" }}>
              <div>
                <button onClick={()=>pushToLikes(collection.cover_photo.id)} style={liked.includes(collection.cover_photo.id)?{color:"red"}:{}}>
                
                  <FavoriteBorderTwoToneIcon />
                                   
                </button>
                <a>
                  <ArrowDownwardTwoToneIcon />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Photo;
