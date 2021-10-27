import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import * as turf from "@turf/turf";
import { isNumber } from "lodash";
import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, Route, Switch } from "react-router-dom";
import "./App.css";
import { FieldPolygon, MapCard, MapMarkerMemoized } from "./components";
import {
  closeFieldInfoWindow,
  fetchDeviceEvents,
  fetchFields,
  getAllDeviceEvents,
  getAllFields,
  getFieldById,
  getFieldCenterById,
  getMostRecentEventsPerField,
} from "./reducers";
import { RootState } from "./reducers/store";
import type { DeviceEvent, Field } from "./types";

/**
 * A marker will be rendered here immediately when the map loads
 */
const FARM_LOCATION: google.maps.LatLngLiteral = {
  lng: -122.350379728,
  lat: 48.494434075,
};

/**
 * Google map settings
 */
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  mapTypeId: "satellite",
};

/**
 * Formats the status of device into a human readable format after a field is clicked
 *
 * @param {DeviceEvent} fieldData - Contains DeviceEvents, Field Info, etc.
 * @param {string} keyName - String of requested field
 * 
 * @returns {string} - All DeviceEvents inside of fieldName's polygons
 */
function formatFieldCardMessage(fieldData: DeviceEvent, keyName: String) {
  if (fieldData.mostRecentEvents[keyName].reel) {
    return `Reel Status ${fieldData.mostRecentEvents[keyName].reel.state_current} Run speed ${fieldData.mostRecentEvents[keyName].reel.run_speed_mmpm}`
  }
  if (fieldData.mostRecentEvents[keyName].pressure) {
    return `Pump Status ${fieldData.mostRecentEvents[keyName].pressure.state_current} KPA ${fieldData.mostRecentEvents[keyName].pressure.reading_kpa}`

  }
  return "No Status"
}

/**
 * If user has clicked on a field, show a card with the field's name
 * and an info window indicating the position of the field on the map.
 * The info window automatically pans to the map by default
 */
function SelectedFieldCard(): JSX.Element | null {
  const dispatch = useDispatch();
  // NOTE: You can use the react-redux hooks api in addition to map state to props
  const fieldData = useSelector((state) => {
    const selectedId = state.fields.selectedId;
    if (typeof selectedId === "undefined") {
      return undefined;
    }
    const fieldName = getFieldById(state, selectedId)?.field_name;
    const center = getFieldCenterById(state, selectedId);
    const mostRecentEvents = getMostRecentEventsPerField(state, "Perez-Brown"); // TODO tried fieldName. Argument of type 'string | undefined' is not assignable to parameter of type 'string'.

    if (typeof fieldName === "undefined" || typeof center === "undefined") {
      throw new Error(`Incomplete field data for id ${selectedId}`);
    }
    return { fieldName, center, mostRecentEvents };
  });
  const handleClose = (): void => {
    dispatch(closeFieldInfoWindow());
  };
  if (typeof fieldData === "undefined") {
    return null;
  }
  return (
    <>
      <MapCard onClose={handleClose} id="field-card" title="Field">
        {fieldData.fieldName}
        {/* TODO filter mostRecentEvents by containsLocation */}
        {Object.keys(fieldData.mostRecentEvents).map((keyName, i) => (
          <div key={i}> 
            <div id="device-name">Device: {keyName}</div>
            <div>Summary: {formatFieldCardMessage(fieldData, keyName)}</div>
          </div>
        ))}
      </MapCard>
      <InfoWindow onCloseClick={handleClose} position={fieldData.center}>
        <div>{fieldData.fieldName}</div>
      </InfoWindow>
    </>
  );
}

function mapStateToProps(state: RootState): {
  deviceEvents: DeviceEvent[];
  fieldIds: number[];
  fields: Field[];
  bounds: google.maps.LatLngBoundsLiteral;
} {
  const fields = getAllFields(state);
  const bounds = new google.maps.LatLngBounds();
  if (fields.length > 0) {
    fields.forEach((field) => {
      const center = turf.centroid(field.polygon);
      const [lng, lat] = center.geometry.coordinates;
      if (isNumber(lng) && isNumber(lat)) {
        bounds.extend({ lng, lat });
      }
    });
  }
  return {
    deviceEvents: getAllDeviceEvents(state),
    fieldIds: state.fields.ids,
    fields: getAllFields(state),
    bounds: bounds.toJSON(),
  };
}

type Props = ReturnType<typeof mapStateToProps>;

/**
 * Entry point for webapp
 *
 * @param props
 * @param props.bounds - bounding box used to position camera
 * @param props.fields - List of fields to be rendered as polygons on the map
 */
function App({ bounds, fields }: Props): JSX.Element {
  const dispatch = useDispatch();

  const mapRef = React.useRef<google.maps.Map | null>(null);

  /**
   * Get a reference to the google map instance when it loads so that you
   * can access its methods, getters, setters, etc.
   * @param map google map instance
   */
  const getMapRef = (map: google.maps.Map): void => {
    mapRef.current = map;
  };

  React.useEffect(
    /**
     * Mock api call to get device events and field data
     */
    () => {
      dispatch(fetchDeviceEvents());
      dispatch(fetchFields());
    },
    [dispatch]
  );

  React.useEffect(
    /**
     * Once fields are loaded, fit the map to them.
     */
    () => {
      if (typeof bounds !== "undefined" && mapRef.current !== null) {
        mapRef.current.fitBounds(bounds);
      }
    },
    [bounds]
  );

  return (
    <div id="app-root" className="app-root">
      <AppBar
        id="appbar"
        color="inherit"
        position="absolute"
        className="app-bar"
      >
        <Toolbar className="tool-bar">
          <Typography
            to="/"
            component={RouterLink}
            className="page-title"
            id="page-title"
            variant="h5"
          >
            Farm HQ
          </Typography>
          <Link component={RouterLink} to="/events">
            Events
          </Link>
        </Toolbar>
      </AppBar>
      <div id="page-content" className="page-content">
        <Switch>
          <Route exact path="/events">
            <div className="events-page">
              <Typography>TODO: Implement</Typography>
            </div>
          </Route>
          <Route exact path="/">
            <GoogleMap
              onLoad={getMapRef}
              id="main-map"
              mapTypeId="satellite"
              options={MAP_OPTIONS}
              zoom={13}
              mapContainerClassName="map-container"
              center={FARM_LOCATION}
            >
              <SelectedFieldCard />
              {fields.map((field) => (
                <FieldPolygon key={field.id} fieldId={field.id} />
              ))}
              <MapMarkerMemoized label="Farm" position={FARM_LOCATION} />
            </GoogleMap>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(App);
