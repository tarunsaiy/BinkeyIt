import { Router, Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./Store/userSlice";
import { setAllCategory } from "./Store/productSlice";
import { useState } from "react";
import  Axios from "./utils/axios.js";
import  SummaryApi from "./common/summaryApi";
import AxiosToastError from "./utils/AxiosToastError"
function App() {

  const dispatch = useDispatch()
  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    // to load all the categorys
    try {
      // setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
        // setCategoryData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error);
    }
    finally {
      // setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory();
  }, [])


  return (
    <>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
