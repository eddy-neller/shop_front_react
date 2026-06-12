import { Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";
import GuestOnlyOutlet from "@/features/Auth/components/GuestOnlyOutlet";
import LoginPage from "@/features/Auth/pages/LoginPage";
import RegisterPage from "@/features/Auth/pages/RegisterPage";
import RegisterSuccessPage from "@/features/Auth/pages/RegisterSuccessPage";
import RegisterValidationPage from "@/features/Auth/pages/RegisterValidationPage";
import RegisterValidationSuccessPage from "@/features/Auth/pages/RegisterValidationSuccessPage";
import ForgotPasswordPage from "@/features/Auth/pages/ForgotPasswordPage";
import ForgotPasswordSuccessPage from "@/features/Auth/pages/ForgotPasswordSuccessPage";
import ResetPasswordPage from "@/features/Auth/pages/ResetPasswordPage";
import UserHomePage from "@/features/User/pages/UserHomePage";
import UserProfilePage from "@/features/User/pages/UserProfilePage";
import UserEditPasswordPage from "@/features/User/pages/UserEditPasswordPage";
import UserAvatarPage from "@/features/User/pages/UserAvatarPage";
import CatalogLayout from "@/features/Shop/layouts/CatalogLayout";
import CatalogHomePage from "@/features/Shop/pages/Catalog/CatalogHomePage";
import ProductDetailPage from "@/features/Shop/pages/Catalog/ProductDetailPage";
import UserAddressesPage from "@/features/Shop/pages/Address/UserAddressesPage";
import CartPage from "@/features/Shop/pages/Cart/CartPage";

const AppRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="products" element={<CatalogLayout />}>
      <Route index element={<CatalogHomePage />} />
      <Route path=":id" element={<ProductDetailPage />} />
    </Route>

    <Route element={<GuestOnlyOutlet fallbackPath="/user" />}>
      <Route path="register">
        <Route index element={<RegisterPage />} />
        <Route path="success" element={<RegisterSuccessPage />} />
        <Route path="validation" element={<RegisterValidationPage />} />
        <Route
          path="validation/success"
          element={<RegisterValidationSuccessPage />}
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password">
        <Route index element={<ForgotPasswordPage />} />
        <Route path="success" element={<ForgotPasswordSuccessPage />} />
        <Route path="reset" element={<ResetPasswordPage />} />
      </Route>
    </Route>

    <Route element={<AuthOutlet fallbackPath="/login" />}>
      <Route path="cart" element={<CartPage />} />
      <Route path="user">
        <Route index element={<UserHomePage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="password" element={<UserEditPasswordPage />} />
        <Route path="avatar" element={<UserAvatarPage />} />
        <Route path="addresses" element={<UserAddressesPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default AppRoutes;
