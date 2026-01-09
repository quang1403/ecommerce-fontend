import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux-setup/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modern Components
import ModernHeader from "./shared/components/layouts/ModernHeader";
import ModernFooter from "./shared/components/layouts/ModernFooter";
import AIChatbot from "./shared/components/AIChatbot/AIChatbot";

import routers from "./routers";
import AdminLayout from "./pages/Admin/components/AdminLayout";
import NewsList from "./pages/NewsList/NewsList";
import NewsDetail from "./pages/NewsList/NewsDetail";

// Global Styles
import "./styles/global-theme.css";
import "./App.css";

const AppContent = () => {
  const location = useLocation();

  // Admin Layout
  if (location.pathname.startsWith("/admin")) {
    return <AdminLayout />;
  }

  // Modern Layout for all user pages
  return (
    <div className="modern-app">
      <ModernHeader />
      <main className="main-content">
        <Routes>
          {routers.map((route, index) => (
            <Route key={index} path={route.path} element={<route.element />} />
          ))}
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </main>
      <ModernFooter />
    </div>
  );
};

const ChatbotWrapper = () => {
  const location = useLocation();

  // Don't show chatbot on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <AIChatbot />;
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <AppContent />
        <ChatbotWrapper />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
export default App;
