import React from "react";

const Restaurant = (props) => {
  const handleOnClick = () => {
    props.onClick(props);
    props.clickHandler();
  };
  return (
    <div className="restaurant">
      <div>
        <p>Nom : {props.nom}</p>
        <p>Adresse :{props.adresse} </p>
        <p>Moyenne : {props.moyenne}</p>
        <button className="boutonAjouter" onClick={handleOnClick}>
          Ajouter un nouvel avis
        </button>
      </div>
    </div>
  );
};

export default Restaurant;
