import React, { Component } from "react";
import "./App.css";
import "./components/components.css";
import MyRestaurants from "./components/MyRestaurants";
import Map from "./components/Map";
import restaurants from "./components/restaurants.json";
import PopUp from "./components/PopUp.js";
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLanguage("fr");

class App extends Component {
  state = {
    listeResto: restaurants,
    selectInf: 0,
    selectSup: 5,
    PopUpRatting: false,
    PopUpNewResto: false,
    opacity: 1,
    center: { lat: 48.8534, lng: 2.3488 },
    noteInput: 6,
    restoClicked: {},
    name: "",
    avis: "",
    comment: [],
    lat: 48.00138958608688,
    long: 0.21067814343630253,
    address: "",
  };
  setCenter = (pos) => {
    this.setState((state) => {
      return { center: pos };
    });
  };
  handlerInf = (valInf) => {
    this.setState({ selectInf: valInf });
  };
  handlerSup = (valSup) => {
    this.setState({ selectSup: valSup });
  };
  handleShowPopUpRatting = () => {
    this.setState({ PopUpRatting: true, PopUpNewResto: false, opacity: 0.3 });
  };
  handleOnChangeNote = (val) => {
    this.setState({ noteInput: parseInt(val) });
  };
  handleOnChangeName = (val) => {
    this.setState({ name: val });
  };
  handleOnChangeAvis = (val) => {
    this.setState({ avis: val });
  };
  handleOnClick = (val) => {
    this.openPopup();
    this.setState({ lat: val.lat(), long: val.lng() });
  };
  address = (lat, long) => {
    Geocode.fromLatLng(lat, long).then(
      (response) => {
        const address = response.results[0].formatted_address;
        this.setState({ address: address });
      },
      (error) => {
        console.error(error);
      }
    );
  };
  openPopup = () => {
    this.setState({
      PopUpNewResto: true,
      PopUpRatting: false,
      opacity: 0.3,
    });
  };
  closePopupNewResto = () => {
    if (this.state.noteInput >= 0 && this.state.noteInput <= 5) {
      this.setState({
        PopUpNewResto: false,
        opacity: 1,
      });
      this.setState({
        listeResto: [
          ...this.state.listeResto,
          {
            name: this.state.name,
            vicinity: this.state.address,
            geometry: {
              location: { lat: this.state.lat, lng: this.state.long },
            },
            rating: this.state.noteInput,
            comment: [this.state.avis],
            user_ratings_total: 1,
          },
        ],
        noteInput: 6,
      });
    } else {
      alert("la note doit être comprise entre 0 et 5");
    }
  };
  cancelPopUp = () => {
    this.setState({
      PopUpRatting: false,
      opacity: 1,
    });
  };
  closePopupRatting = () => {
    if (this.state.noteInput >= 0 && this.state.noteInput <= 5) {
      const newList = [...this.state.listeResto];
      let index = newList.findIndex(
        (resto) => resto.name === this.state.restoClicked.nom
      );
      if (newList[index].comment) {
        newList[index].comment.push(this.state.avis);
      } else {
        newList[index].comment = [this.state.avis];
      }
      newList[index].user_ratings_total = newList[index].user_ratings_total + 1;
      newList[index].rating =
        Math.round(
          ((newList[index].rating * (newList[index].user_ratings_total - 1) +
            this.state.noteInput) /
            newList[index].user_ratings_total) *
            10
        ) / 10;
      this.setState({ listeResto: newList });
      this.setState({
        listeResto: newList,
        PopUpRatting: false,
        opacity: 1,
        noteInput: 6,
      });
    } else {
      alert("la note doit être comprise entre 0 et 5");
    }
  };
  addResto = (resto) => {
    this.setState({ restoClicked: resto });
  };
  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.setCenter(pos);
        },
        function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            console.log("Vous n'avez pas accepté la géolocalisation");
          }
        }
      );
    } else {
      console.log("La géolocalisation n'est pas disponible");
    }
    fetch(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        this.state.lat +
        "," +
        this.state.long +
        "&radius=1500&type=restaurant&key=" +
        process.env.REACT_APP_GOOGLE_API_KEY
    )
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          console.log(result);
          this.setState({ listeResto: result.results });
        },
        (error) => {
          console.log("erreur");
        }
      );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.lat !== this.state.lat) {
      this.address(this.state.lat, this.state.long);
    }
  }
  render() {
    this.state.selectInf > this.state.selectSup &&
      alert("Le premier chiffre doit être inférieur au second");
    const listeSelect = [];
    this.state.listeResto.map((resto) => {
      resto.rating >= this.state.selectInf &&
        resto.rating <= this.state.selectSup &&
        listeSelect.push(resto);
    });
    return (
      <div>
        <div style={{ opacity: this.state.opacity }}>
          <h1>Avis de restaurants</h1>
          <Map
            listeResto={listeSelect}
            center={this.state.center}
            latLng={this.handleOnClick}
          />
          <MyRestaurants
            listeResto={listeSelect}
            handlerinf={this.handlerInf}
            handlersup={this.handlerSup}
            handleShowPopUp={this.handleShowPopUpRatting}
            clickResto={this.addResto}
          />
        </div>
        {this.state.PopUpNewResto ? (
          <PopUp
            titre="Ajouter un nouveau restaurant"
            closePopup={this.closePopupNewResto}
            onChange={this.handleOnChangeNote}
            onChangeName={this.handleOnChangeName}
            onChangeAvis={this.handleOnChangeAvis}
          />
        ) : null}
        {this.state.PopUpRatting ? (
          <PopUp
            titre="Ajouter un nouvel avis"
            resto={this.state.restoClicked.nom}
            closePopup={this.closePopupRatting}
            cancelPopUp={this.cancelPopUp}
            onChange={this.handleOnChangeNote}
            onChangeAvis={this.handleOnChangeAvis}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
