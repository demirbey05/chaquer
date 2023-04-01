import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { ComponentBrowser } from "./ComponentBrowser";
import { TerrainProvider } from "./context/TerrainContext";
import { ChakraProvider } from "@chakra-ui/react";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  root.render(
    <MUDProvider {...result}>
      <TerrainProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </TerrainProvider>
      <ComponentBrowser />
    </MUDProvider>
  );
});
