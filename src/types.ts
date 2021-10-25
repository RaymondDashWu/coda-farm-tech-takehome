//! DO NOT MODIFY

export type DeviceEvent = {
  id: number;
  device_alias: string;
  event_timestamp: string;
  reel?: {
    state_current: "RR" | "RS" | "RE";
    run_speed_mmpm?: number;
  };
  gps?: {
    state_current: "I" | "A";
    altitude?: number;
    n_sats?: number;
    location?: {
      type: "Point";
      coordinates: number[];
    };
  };
  pressure?: {
    reading_kpa: number;
    state_current: "PHI" | "PLO" | "POV"; // high, low, or over
  };
};
export type Field = {
  id: number;
  field_name: string;
  polygon: {
    type: "Polygon";
    coordinates: number[][][];
  };
};
