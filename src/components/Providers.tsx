import React from "react";

import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import LoadMaps from "./LoadMaps";
import store from "../reducers";

/**
 * Wrappers around main App.tsx component including redux provider,
 * routing provider, and Mui CSS baseline
 * @param props
 */
export default function Providers({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
  return (
    <Provider store={store}>
      <CssBaseline />
      <LoadMaps>
        {process.env.NODE_ENV === "test" ? (
          <MemoryRouter>
            <Route path="/">{children}</Route>
          </MemoryRouter>
        ) : (
          <BrowserRouter>
            <Route path="/">{children}</Route>
          </BrowserRouter>
        )}
      </LoadMaps>
    </Provider>
  );
}
