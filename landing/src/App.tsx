import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
