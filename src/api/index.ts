import type { DeviceEvent, Field } from "../types";
import deviceEventsJson from "./events.json";
import fieldsJson from "./fields.json";

// ! NOTE: Do not modify this file
/**
 * Mocks an api call returning a list of device events
 * @returns list of device events
 */
export function getEventDataFromMockedApi(): Promise<DeviceEvent[]> {
  return new Promise<DeviceEvent[]>((resolve) =>
    setTimeout(
      () =>
        resolve(
          deviceEventsJson.map((de, i) => ({ ...de, id: i })) as DeviceEvent[]
        ),
      1000 - Math.round(Math.random() * 50)
    )
  );
}
/**
 * Mocks an api call returning a list of device events
 * @returns list of fields
 */
export function getFieldDataFromMockedApi(): Promise<Field[]> {
  return new Promise<Field[]>((resolve) =>
    setTimeout(
      () => resolve(fieldsJson.map((de, i) => ({ ...de, id: i })) as Field[]),
      1000 - Math.round(Math.random() * 50)
    )
  );
}
