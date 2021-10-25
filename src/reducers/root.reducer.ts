import { combineReducers } from "@reduxjs/toolkit";
import deviceEventsReducer from "./events";
import fieldsReducer from "./fields";

export default combineReducers({
  deviceEvents: deviceEventsReducer,
  fields: fieldsReducer,
});
