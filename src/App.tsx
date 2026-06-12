import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import AppRoutes from "@/routes";
import { AbilityProvider } from "@/contexts/AbilityContext";
import "@/App.scss";
import { HelmetProvider } from "react-helmet-async";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { CartProvider } from "@/features/Shop/contexts/CartContext";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(AppRoutes));

  const store = createStore({
    authName: "_auth_shop",
    authType: "localstorage",
  });

  return (
    <HelmetProvider>
      <BreadcrumbProvider>
        <AuthProvider store={store}>
          <AbilityProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </AbilityProvider>
        </AuthProvider>
      </BreadcrumbProvider>
    </HelmetProvider>
  );
}

export default App;
