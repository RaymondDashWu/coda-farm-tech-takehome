import { Marker, MarkerProps } from "@react-google-maps/api";
import React from "react";
type Props = Omit<MarkerProps, "label"> & { label: string };

/**
 *  Don't re-render unless the marker's position has changed
 * @param props
 * @param nextProps
 */
function propsAreEqual(props: Props, nextProps: Props): boolean {
  if (
    props.position.lng !== nextProps.position.lng ||
    props.position.lat !== nextProps.position.lat
  ) {
    return false;
  }
  return true;
}
/**
 * Memoizes Marker component from "@react-google-maps/api" module
 *
 * @augments Marker
 * @param props - All normal marker props
 */
const MapMarker: React.FC<Props> = ({ label, ...props }) => {
  const labelMemo = React.useMemo((): google.maps.MarkerLabel => {
    return {
      text: label,
      color: "white",
    };
  }, []);
  return <Marker label={labelMemo} {...props} />;
};

const MapMarkerMemoized = React.memo<Props>(MapMarker, propsAreEqual);
MapMarkerMemoized.displayName = "MapMarkerMemoized";
export default MapMarkerMemoized;
