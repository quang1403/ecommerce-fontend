import NotFound from "../pages/NotFound";
import Category from "../pages/Category";
import ModernProductDetails from "../pages/ProductDetails/ModernProductDetails";
import Cart from "../pages/Cart";
import ModernCart from "../pages/Cart/ModernCart";
import ModernHome from "../pages/Home/ModernHome";
import Search from "../pages/Search/Search";
import AllProducts from "../pages/Products/AllProducts";
import Success from "../pages/Success";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthRequired from "../shared/AuthRequired";
import Payment from "../pages/Payment";
import UserEdit from "../pages/UserEdit";
import AdminLayout from "../pages/Admin/components/AdminLayout";
import CustomerList from "../pages/Admin/components/CustomerList";
import SliderManagement from "../pages/Admin/components/SliderManagement";
import RequireAdmin from "../shared/AuthRequired/RequireAdmin";
import OrderList from "../pages/OrderList";
import Deals from "../pages/Deals";
import NewsList from "../pages/NewsList/NewsList";
import NewsDetail from "../pages/NewsList/NewsDetail";
import Support from "../pages/Support";
import Privacy from "../pages/Legal/Privacy";
import Terms from "../pages/Legal/Terms";
import Cookies from "../pages/Legal/Cookies";
import LegalWarranty from "../pages/Legal/Warranty";
import WarrantyLookup from "../pages/Warranty";
import ReturnPolicy from "../pages/Legal/ReturnPolicy";
import Shipping from "../pages/Legal/Shipping";
import PaymentGuide from "../pages/Legal/PaymentGuide";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import AuthGoogleSuccess from "../pages/Auth/AuthGoogleSuccess";
import InstallmentPage from "../pages/Installment";
export default [
  {
    path: "/",
    element: ModernHome,
  },
  {
    path: "/category/:id",
    element: Category,
  },
  {
    path: "/ProductDetails/:id",
    element: ModernProductDetails,
  },
  {
    path: "/product/:id",
    element: ModernProductDetails,
  },
  {
    path: "/products/search",
    element: Search,
  },
  {
    path: "/products",
    element: AllProducts,
  },
  {
    path: "/Cart",
    element: ModernCart,
  },
  {
    path: "/login",
    element: AuthRequired.CheckLogged(Login),
  },
  {
    path: "/register",
    element: AuthRequired.CheckLogged(Register),
  },
  {
    path: "/forgot-password",
    element: AuthRequired.CheckLogged(ForgotPassword),
  },
  {
    path: "/reset-password",
    element: AuthRequired.CheckLogged(ResetPassword),
  },
  {
    path: "/auth/google/success",
    element: AuthGoogleSuccess,
  },
  {
    path: "/OrderList",
    element: AuthRequired.RequireAuth(OrderList),
  },
  {
    path: "/Payment",
    element: AuthRequired.RequireAuth(Payment),
  },
  {
    path: "/UserEdit",
    element: AuthRequired.RequireAuth(UserEdit),
  },
  {
    path: "/warranty",
    element: AuthRequired.RequireAuth(WarrantyLookup),
  },
  {
    path: "/admin",
    element: RequireAdmin(AdminLayout),
  },
  {
    path: "/admin/customers",
    element: RequireAdmin(CustomerList),
  },
  {
    path: "/admin/sliders",
    element: RequireAdmin(SliderManagement),
  },
  {
    path: "/deals",
    element: Deals,
  },
  {
    path: "/news",
    element: NewsList,
  },
  {
    path: "/news/:id",
    element: NewsDetail,
  },
  {
    path: "/support",
    element: Support,
  },
  {
    path: "/privacy",
    element: Privacy,
  },
  {
    path: "/terms",
    element: Terms,
  },
  {
    path: "/cookies",
    element: Cookies,
  },
  {
    path: "/warranty-policy",
    element: LegalWarranty,
  },
  {
    path: "/return-policy",
    element: ReturnPolicy,
  },
  {
    path: "/shipping",
    element: Shipping,
  },
  {
    path: "/payment-guide",
    element: PaymentGuide,
  },
  {
    path: "/installment/:productId",
    element: InstallmentPage,
  },
  {
    path: "*",
    element: NotFound,
  },
];
