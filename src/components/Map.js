import React, { Component } from "react";
import "./components.css";
import marqueur from "./map_pin_icon1.png";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
  StreetViewPanorama,
} from "react-google-maps";

class Carte extends Component {
  state = {
    selectedResto: null,
  };
  setSelectedResto = (resto) => {
    this.setState((state) => {
      return { selectedResto: resto };
    });
  };
  handleOnClick = (event) => {
    this.props.latLng(event.latLng);
  };
  render() {
    return (
      <div id="map">
        <GoogleMap
          defaultZoom={10}
          center={this.props.center}
          onClick={this.handleOnClick}
        >
          <Marker position={this.props.center} icon={marqueur} />
          {this.props.listeResto.map((resto, i) => (
            <Marker
              key={i}
              position={{
                lat: resto.geometry.location.lat,
                lng: resto.geometry.location.lng,
              }}
              onClick={() => this.setSelectedResto(resto)}
            />
          ))}
          {this.state.selectedResto && (
            <InfoWindow
              position={{
                lat: this.state.selectedResto.geometry.location.lat,
                lng: this.state.selectedResto.geometry.location.lng,
              }}
              onCloseClick={() => {
                this.setSelectedResto(null);
              }}
            >
              <div>
                <h1>{this.state.selectedResto.name}</h1>
                <h2>{this.state.selectedResto.vicinity}</h2>
                <p> Moyenne : {this.state.selectedResto.rating}</p>
                <ul>
                  {this.state.selectedResto.comment &&
                    this.state.selectedResto.comment.map((avis, i) => {
                      return <li key={i}>{avis}</li>;
                    })}
                </ul>
              </div>
            </InfoWindow>
          )}
          {this.state.selectedResto && (
            <StreetViewPanorama
              position={{
                lat: this.state.selectedResto.geometry.location.lat,
                lng: this.state.selectedResto.geometry.location.lng,
              }}
              visible
            />
          )}
        </GoogleMap>
      </div>
    );
  }
}
const WrappedMap = withScriptjs(withGoogleMap(Carte));

const Map = (props) => {
  return (
    <div className="map">
      <WrappedMap
        googleMapURL={
          "https://maps.googleapis.com/maps/api/js?key=" +
          process.env.REACT_APP_GOOGLE_API_KEY
        }
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        listeResto={props.listeResto}
        center={props.center}
        latLng={props.latLng}
      />
    </div>
  );
};
export default Map;
