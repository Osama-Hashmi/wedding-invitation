import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Baraat from "./pages/Baraat";
import Valima from "./pages/Valima";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main / Family Invitation */}
        <Route path="/" element={<Home />} />

        {/* Baraat Guest Invitation */}
        <Route path="/baraat" element={<Baraat />} />

        {/* Valima Guest Invitation */}
        <Route path="/valima" element={<Valima />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;