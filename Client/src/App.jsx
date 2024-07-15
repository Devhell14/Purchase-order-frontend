import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Home from "./pages/Home";
import Form from "./pages/Form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/form/:id",
    element: <Form />,
  },
]);

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ margin: "30px" }}>
        <RouterProvider router={router} />
      </div>
    </LocalizationProvider>
  );
};
export default App;
