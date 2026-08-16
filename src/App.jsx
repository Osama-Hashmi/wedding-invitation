import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Mehndi from "./Mehndi";
import Mehndi2 from "./Mehndi2";
import Baraat from "./pages/Baraat";
import Valima from "./pages/Valima";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/home-wedding-2026-1187"
          element={<Home />}
        />

        {/* MEHNDI 1 */}
        <Route
          path="/mehndi-invite-2741"
          element={<Mehndi />}
        />

        {/* MEHNDI 2 */}
        <Route
          path="/mehndi-2-invitation-5836"
          element={<Mehndi2 />}
        />

        {/* BARAAT */}
        <Route
          path="/baraat-invitation-9142"
          element={<Baraat />}
        />

        {/* VALIMA */}
        <Route
          path="/valima-invite-7365"
          element={<Valima />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;