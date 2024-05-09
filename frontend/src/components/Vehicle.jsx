import React from "react";

const Vehicle = ({ data }) => {
  return (
    <div className="vehicle">
      <h1>{`${data.make} ${data.model}`}</h1>
      <p>Рег. Номер: {data.reg}</p>
      <p>Година: {data.year} г.</p>
      <p>Километраж: {data.km} км</p>
      <p>Тип Гориво: {data.fuel}</p>
      <p>Nomer na DWG: {data.engNum}</p>
      <p>Nomer Rama: {data.bodyNum}</p>
      <p>GTP do: {data.gtp}</p>
      <p>GO do: {data.insurance}</p>
      <p>Evro Kategoriq: {data.cat}</p>
      <p>danuk za godina: {data.tax}</p>
      <p>Gumi razmer: {data.tires}</p>
      <p>Talon nomer: {data.talonNum}</p>
      <p>Kasko do: {data.kasko}</p>
      <p>Sobstwenik: {data.owner}</p>
      <p>Tip: {data.type}</p>
    </div>
  );
};

export default Vehicle;
