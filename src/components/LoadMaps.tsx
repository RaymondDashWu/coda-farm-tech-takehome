import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (typeof googleMapsApiKey === "undefined") {
  throw new Error(`
  No google maps api key detected in .env file. 
  Make sure you have created a google maps api key
  and copied it into a file called .env in the root of the project like this:\n
  REACT_APP_GOOGLE_MAPS_API_KEY=#Your key here, no quotations\n
  Once you do, you will need to restart your dev server (npm start in terminal)
  `);
}

/**
 * Defers loading children until google maps API is loaded
 * @param props
 */

export default function LoadMaps({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element | null {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
  });
  if (loadError) {
    throw new Error("Unable to load google maps ");
  }
  if (isLoaded) {
    return (children ?? null) as JSX.Element | null;
  }
  return <div className="loading-maps">Loading google maps</div>;
}
