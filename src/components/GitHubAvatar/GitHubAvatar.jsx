import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounced';
import './GitHubAvatar.css';


const GitHubAvatarApp = () => {
  const [username, setUsername] = useState('');
  const [userDatas, setUserDatas] = useState([]);
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const userIds = Array.from({ length: 20 }, (_, index) => `user${index + 1}`);

    const fetchUserDatas = async () => {
      const promises = userIds.map(async id => {
        try {
          const response = await fetch(`https://api.github.com/users/${id}`);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching data for ${id} from GitHub API`, error);
          return null;
        }
      });

      const fetchedUserDatas = await Promise.all(promises);
      setUserDatas(fetchedUserDatas.filter(data => data !== null));
    };

    if (debouncedUsername) {
      fetch(`https://api.github.com/users/${debouncedUsername}`)
        .then(response => response.json())
        .then(data => {
          setUserDatas([data]);
        })
        .catch(error => {
          console.error('Error fetching data from GitHub API', error);
          setUserDatas([]);
        });
    } else {
      fetchUserDatas();
    }
  }, [debouncedUsername]);

  const handleInputChange = event => {
    setUsername(event.target.value);
  };

  return (
    <div className='all-wrapper'>
      <h1>GitHub Avatar Finder</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        className='search-input'
        onChange={handleInputChange}
      />
      {userDatas.length > 0 && (
        <div className='sub-wrapper'>
          {userDatas.map((userData, index) => (
            <div key={index}>
              <img className='image' src={userData.avatar_url} alt="GitHub Avatar" name={userData.login} />
              <h3 className='image-name'>{userData.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubAvatarApp;
