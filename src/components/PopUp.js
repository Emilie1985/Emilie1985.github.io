import React from "react";
import "./components.css";

const PopUp = (props) => {
  const handleChangeNote = (event) => {
    props.onChange(event.target.value);
  };
  const handleChangeName = (event) => {
    props.onChangeName(event.target.value);
  };
  const handleChangeAvis = (event) => {
    props.onChangeAvis(event.target.value);
  };

  return (
    <div className="popup">
      <div className="popup\_inner">
        <h1>{props.titre}</h1>
        Nom du restaurant :
        {props.resto ? (
          props.resto
        ) : (
          <input type="text" onChange={handleChangeName}></input>
        )}
        {<br />}
        {<br />}
        Votre note : {<br />}
        <input
          type="number"
          min={0}
          max={5}
          onChange={handleChangeNote}
        ></input>
        {<br />}
        Votre avis :{" "}
        <textarea cols={30} rows={10} onChange={handleChangeAvis}></textarea>
        <button onClick={props.closePopup}>Envoyer l'avis</button>
        <button onClick={props.cancelPopUp}>Annuler</button>
      </div>
    </div>
  );
};

export default PopUp;
