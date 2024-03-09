import "./App.css";
import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage=window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 15.2551,
    latitude: 54.526,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/pins");
        console.log(response.data);
        setPins(response.data);
        console.log("api runs");
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    console.log(e);
    const { lat, lng } = e.lngLat;
    setNewPlace({
      lat,
      lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };
    try {
      const res = await axios.post("http://localhost:8080/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch {}
  };

  const handleLogOut=()=>{
myStorage.removeItem("user")
setCurrentUser(null)
  }
  return (
    <div className="app">
      <Map
        {...viewState}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/amjad-awan/clajzibn3004n14ul37c19wvq"
        onDblClick={handleAddClick}
        animate={true}
        duration="1000"
      >
        {pins?.map((pin, i) => {
          return (
            <div key={i}>
              <Marker
                latitude={pin.lat}
                longitude={pin.long}
                rotationAlignment="viewport"
                anchor="center"
                // offsetLeft={-viewState.zoom * 7}
                // offsetTop={viewState.zoom * 7}
              >
                <Room
                  style={{
                    fontSize: viewState.zoom*7,
                    color:
                      pin.username===currentUser?"tomato":"slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                />
              </Marker>
              {pin._id===currentPlaceId&& (
                <Popup
                  latitude={pin.lat}
                  longitude={pin.long}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="bottom"
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="desc">{pin.desc}</p>
                    <label>Rating</label>
                    <div className="starts">
                      {Array(pin.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b> {pin.username} </b>
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
              {newPlace && (
                <Popup
                  latitude={newPlace.lat}
                  longitude={newPlace.lng}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setNewPlace(null)}
                  anchor="bottom"
                  className="user-popup"
                >
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label>Title</label>
                      <input
                        type="text"
                        placeholder="Enter a title "
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <label>Review</label>
                      <textarea
                        placeholder="Say a something about this place"
                        onChange={(e) => setDesc(e.target.value)}
                      ></textarea>

                      <label>Rating</label>
                      <select onChange={(e) => setRating(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button className="submitBtn">Add Pin</button>
                    </form>
                  </div>
                </Popup>
              )}
            </div>
          );
        })}
        {currentUser ? (
          <button className="button logout " onClick={handleLogOut}>Log out</button>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => setShowLogin(true)}
            >
              Log in
            </button>
            <button
              className="button register"
              
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </Map>
    </div>
  );
}

export default App;
