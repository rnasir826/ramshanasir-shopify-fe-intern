import axios from 'axios'
import {useState, useCallback, useEffect} from 'react'
import _ from "lodash";
import ls from 'local-storage';

// Styling
import './App.css';
//Movies
import MovieCard from './MovieCard';

function App() {

    // Use states
    const [searchQuery, setSearchQuery] = useState('')
    const [resultData, setResultData] = useState([])
    const [nominations, setNominations] = useState([])

    const sendQuery = async query => {
      let data = await axios.get(`http://www.omdbapi.com/?apikey=a64527c9&s=${query}`)
        setResultData(data.data.Search)
    };

    const delayedQuery = useCallback(_.debounce(q => sendQuery(q), 500), []);

    // Handles
    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value)
        delayedQuery(e.target.value)
    }

    const addtoNominations = (item) => {
        if (!nominations || nominations.length === 0) {
          setNominations([item])

          // adding to localStorage
          ls.set('nominations', [item]);
        } else {
          let newNominations = [...nominations, item]
          setNominations([...nominations, item])

          // adding to localStorage
          ls.set('nominations', newNominations);
        }
    }

    const removeFromNomination = (index) => {
        let array = [...nominations]

        if (index !== -1) {
            array.splice(index, 1);
            setNominations(array);
        }
    }

    // Logic Handles
    const isBtnDisabled = (item) => {
        return nominations && (nominations.includes(item) || nominations.length >= 5)
    }

    useEffect(() => {
        let myNominations = ls.get('nominations');
        setNominations(myNominations)
    }, [])
  
  return (
    <div className="app-body">
      <div className="sub-body">
      <h1 className="header-main" >Movie Lookup!</h1>
      
      {/* TODO: MAKE COMPONENT */}
      <div className="input-body">
        <input 
          className="input-field"
          label="Search for movies..."
          value={searchQuery}
          placeholder="🔎 for movies..."
          onChange={handleSearchQuery}
        />
      </div>

      {
        searchQuery ?
        <div className="header-sub-body">
          <h1 className="header-sub">Results for "{searchQuery}"</h1>
        </div> 
      :
      null
      }

      <div className="body-components">
      <ul className="ul-right">
        {
          resultData ? 
          resultData.map((item, index) => {
            return (
              <li>
                <MovieCard 
                  key={index}
                  index={index}
                  item={item}  
                  isBtnDisabled={isBtnDisabled}
                  addtoNominations={addtoNominations}
                />
              </li>
            )
          }) 
          :
          <div>
            No Data to show
          </div> 
        }
      </ul>

      <hr></hr>

      <ul className="ul-left">
        {
          !nominations ? 
          <div>
            Nominations not found
          </div> :
          nominations.map((item, index) => {
            return (
              <li>
                <MovieCard 
                  key={index}
                  index={index}
                  item={item}  
                  isBtnDisabled={isBtnDisabled}
                  removeFromNomination={removeFromNomination}
                />
              </li>
            )
          })
        }
        {
          (nominations!==null && nominations.length > 4) ?         
            <div>
              <h1>Can't add anymore movies</h1>
              <h1>Nomination limit = 5 per user</h1>
            </div> 
        : null
        }
      </ul>
      </div>
      
      </div>

    </div>
  );
}

export default App;