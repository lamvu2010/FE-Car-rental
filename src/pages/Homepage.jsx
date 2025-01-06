import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import FindCar from "../components/FindCar";
import CarsForU from "../components/CarsForU";



function Homepage() {

    return (
        <div>
            <Header />
            <Banner />
            <FindCar />
            <CarsForU />
            <Footer />
        </div>
    );
}
export default Homepage