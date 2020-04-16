import React from "react";

const Select = (props) => {
  const handleOnChange = (event) => {
    props.onChange(event.target.value);
  };
  return (
    <select id="selectInf" onChange={handleOnChange}>
      <option value="0">0 étoile</option>
      <option value="1">1 étoile</option>
      <option value="2">2 étoiles</option>
      <option value="3">3 étoiles</option>
      <option value="4">4 étoiles</option>
      <option value="5">5 étoiles</option>
    </select>
  );
};

export default Select;
