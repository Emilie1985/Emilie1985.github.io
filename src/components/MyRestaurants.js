import React from "react";
import Restaurant from "./Restaurants.js";
import Select from "./Select.js";

const MyRestaurants = (props) => {
  const handleOnChangeInf = (note) => {
    props.handlerinf(note);
  };
  const handleOnChangeSup = (note) => {
    props.handlersup(note);
  };
  const handleOnClickButton = () => {
    props.handleShowPopUp(true);
  };
  const addResto = (resto) => {
    props.clickResto(resto);
  };
  return (
    <div>
      <div className="liste">
        <h1> Liste des restaurants</h1>
        <p>
          Afficher uniquement les restaurants ayant entre
          <Select onChange={handleOnChangeInf} />
          et
          <Select onChange={handleOnChangeSup} />
        </p>
        <ul>
          {props.listeResto.map((resto, index) => {
            return (
              <Restaurant
                key={index.toString()}
                id1={index}
                nom={resto.name}
                adresse={resto.vicinity}
                moyenne={resto.rating}
                clickHandler={handleOnClickButton}
                onClick={addResto}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MyRestaurants;
