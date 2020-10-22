import React from "react";

//receive array of arrays so to access name of first heir
// <h1>Name: {heirs[0][0]}</h1>
// <h1>Address: {heirs[0][1]}</h1>
// <h1>Share: {heirs[0][2]}</h1>
function HeirList({ heirs }) {
  console.log('heirs received, ', heirs);
  return (
    <div>
      Ayyyy
      {heirs.forEach((heir) => {
        return <div>
          <h1>Name: {heir[0]} </h1>
          <h2>Address: {heir[1]}</h2>
          <h3>Share: {heir[2]}</h3>
        </div>;
      })}
    </div>
  );
}

export default HeirList;
