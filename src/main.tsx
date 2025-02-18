import { createRoot } from "react-dom/client";
import { App } from "./pages/main/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { ItemDetailed } from "./pages/item/itemDetailed.tsx";
import "./globalStyles.scss";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path={"/"} element={<App />} />
      <Route path={"/item/:id"} element={<ItemDetailed />} />
    </Routes>
  </BrowserRouter>,
);
