// MapContext.js
import React, { createContext, useContext, useRef } from "react";

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);

  return <MapContext.Provider value={mapRef}>{children}</MapContext.Provider>;
};
