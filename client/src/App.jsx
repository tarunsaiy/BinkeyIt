import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./Store/userSlice";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./Store/productSlice";
import Axios from "./utils/axios.js";
import SummaryApi from "./common/summaryApi";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./Provider/GlobalProvider.jsx";
import CheckOutDisplay from "./Components/CheckOutDisplay.jsx";
import { useGlobalContext } from "./Provider/GlobalProvider.jsx";

function AppContent() {
  const { checkoutOpen, closeCheckout } = useGlobalContext();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {checkoutOpen && <CheckOutDisplay close={closeCheckout} />}
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData?.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));

      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;
