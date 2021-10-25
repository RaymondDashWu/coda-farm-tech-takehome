import { Polygon } from "@react-google-maps/api";
import { isUndefined, kebabCase } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clickField, getFieldById, getFieldCenterById } from "../reducers";
import MapMarkerMemoized from "./MapMarkerMemoized";

const FIELD_OPTIONS: google.maps.PolygonOptions = {
  fillColor: "blue",
  fillOpacity: 0.5,
  strokeColor: "cyan",
  strokeWeight: 1.5,
};

/**
 * Render a polygon on the map representing a field.
 *
 * Opens an info window when clicked
 * @param props
 * @param props.fieldId
 */
function FieldPolygon({ fieldId }: { fieldId: number }): JSX.Element | null {
  const dispatch = useDispatch();
  const field = useSelector((state) => getFieldById(state, fieldId));
  const center = useSelector((state) => getFieldCenterById(state, fieldId));
  if (typeof field === "undefined") {
    throw new Error(`No field for id: ${fieldId}`);
  }
  if (typeof center === "undefined") {
    throw new Error(`Unable to calculate field center for id: ${fieldId}`);
  }
  const outerRing = field.outerRing;

  const handleClick = React.useCallback((): void => {
    dispatch(clickField(field.id));
  }, []);

  const centerIcon = React.useMemo((): google.maps.Symbol => {
    return {
      labelOrigin: new google.maps.Point(0, 0),
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "transparent",
      strokeColor: "transparent",
    };
  }, []);
  if (isUndefined(outerRing)) {
    return null;
  }
  return (
    <>
      <Polygon
        onClick={handleClick}
        options={FIELD_OPTIONS}
        key={field.id}
        path={outerRing}
      />
      <MapMarkerMemoized
        onClick={handleClick}
        title={kebabCase(field.field_name)}
        icon={centerIcon}
        position={center}
        label={field.field_name}
      />
    </>
  );
}
export default FieldPolygon;
