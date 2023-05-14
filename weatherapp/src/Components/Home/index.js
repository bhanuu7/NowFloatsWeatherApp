import { useState, useEffect } from 'react'
import './index.css'
import { GrFavorite } from 'react-icons/gr'
import { MdFavorite } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
const Home = () => {
    const myApiKey = "4f29150297586ec4587c42867b68ff84"
    const [location, setLocation] = useState('')
    const [data, setData] = useState({})
    const [err, setErr] = useState('')
    const [favorites,setFavorites] = useState([])

    useEffect(() => {
        const storedLocations = localStorage.getItem('favoriteLocations');
        if (storedLocations) {
            setFavorites(JSON.parse(storedLocations));
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const url =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${myApiKey}`;
            fetchWeather(url)  
        },
            (error) => {
                if (error.message === "User denied Geolocation") {
                    setErr("Enable Location and Refresh the page")
                }
                else {
                    console.log(error.message);
                }
            })
    }, []);

    const fetchWeather = async (url) => {
        try {
            const response = await fetch(url)
            const data = await response.json()
            setData(data)
            console.log(data)
            if (data.cod === '404') {
                setErr(data.message)
            }
            else {
                setLocation(data.name)
            }
        }
        catch (error) { 
            setErr(error.message)
        }
        
    }

    const keyDown = (event) => {
        if (event.key === "Enter") {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${myApiKey}`
            fetchWeather(url)
        }
    }

    const addToFavorites = () => {
        if (!favorites.includes(location)) {
            setFavorites([...favorites, location])
            localStorage.setItem(
                'favoriteLocations',
                JSON.stringify([...favorites, location])
            );
        }   
    }

    const loadFavorite = (event) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${event.target.innerText}&units=imperial&appid=${myApiKey}`
        fetchWeather(url)
        
    }

    const removeFavorite = (each) => {
        const updatedFavorites = favorites.filter((item) => item !== each)
        setFavorites(updatedFavorites)
        // console.log(fa)
        localStorage.setItem(
            'favoriteLocations',
            JSON.stringify([...updatedFavorites])
        );
    }

    return (
        <div className="bgContainer">
            <input type="search" className="search-container" value={location}  placeholder="search" onChange={(e) => setLocation(e.target.value)} onKeyDown={keyDown} />
                {Object.keys(data).length>2 ? (
                <div className="report-container">
                    {favorites.includes(location) ? (<MdFavorite className="like" />) :
                        (<GrFavorite className="position" onClick={addToFavorites} />)}
                    <h2 className="heading">{data.name}</h2>
                    <p>Weather: {data.weather[0].main}</p>
                    <p>Wind:{data.wind.speed} km/h</p>
                    <p>Humidity - {data.main.humidity} %</p>
                    <p>Temparature- {((data.main.temp - 32) * (5 / 9)).toFixed(1)}<sup>o</sup>C feels like:{((data.main.feels_like - 32) * (5 / 9)).toFixed(1)}<sup>o</sup>C </p>
                </div>
                ) : <p className="error">{err}</p>}
            <h2>Favorites</h2>
            <ul>
                
                {favorites.map((each) => 
                    <li className="favorite" key={each }>
                        <p className="favorite-locations" onClick={loadFavorite}>{each}</p>
                        <AiFillCloseCircle onClick={()=>removeFavorite(each)}/>
                    </li>
                    )
                    }
                
            </ul>
        </div>
    )
     
}

export default Home