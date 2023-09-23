import { Outlet, useLocation } from "react-router-dom";
import { menuRoutes } from "../routes/menuRoutes";
import { Footer } from "./footer/Footer";
import styled from "styled-components/macro";
import { HeroLanding } from "./hero/HeroLanding";
import { NewsLetter } from "./newsletter/NewsLetter";
import useScrollRestoration from "../hooks/useScrollRestoration";
import { useGlobalLoader } from "../hooks/useGlobalLoader";
import { HeroSmall } from "./hero/HeroSmall";
import { SideCart } from "../pages/cart/SideCart";
import { useContext, useEffect, useState } from "react";
import { GlobalToolsContext } from "../context/GlobalToolsContext";
import { NavMobile } from "./navbar/NavMobile";
import { NavDesktop } from "./navbar/NavDesktop";
import { LoadingTopBar } from "../common/loadingTopBar/LoadingTopBar";

////////////////////////////////////////////////////

export const Layout = () => {
  ////////////////////////////////////////////////////

  //Flash loading effect
  const loading = useGlobalLoader();

  ////////////////////////////////////////////////////

  //Restore scroll to top on navigation
  useScrollRestoration();

  ////////////////////////////////////////////////////

  //SideMenu Context
  const {
    isOpen,
    isMenuOpen,
    isFilterOpen,
    windowWidth,
    progress,
    setProgress,
    buffer,
  } = useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////

  // Prevent scrolling when the SideCart is open
  useEffect(() => {
    if (isOpen && isMenuOpen && isFilterOpen) {
      document.body.style.overflow = "inherit";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpen, isMenuOpen, isFilterOpen]);

  ////////////////////////////////////////////////////

  //Find "Home" and "ItemDetail" locations
  const location = useLocation();
  const currentRoute = menuRoutes.find(
    (route) => route.path === location.pathname
  );
  const isHome = currentRoute?.id === "home";
  /* const isItemDetail = useMatch("/item-details/:id"); */

  return (
    <>
      <Wrapper
        isOpen={isOpen}
        isMenuOpen={isMenuOpen}
        isFilterOpen={isFilterOpen}
      >
        {!isHome && <LoadingTopBar />}
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {windowWidth > 900 && <NavDesktop />}
            {windowWidth <= 900 && <NavMobile />}
            <SideCart />
            {!isHome && <HeroSmall />}
            <HeroWrapper>{isHome && <HeroLanding />}</HeroWrapper>

            <OutletWrapper isHome={isHome}>
              <Outlet />
            </OutletWrapper>

            <NewsLetter />
            <Footer />
          </>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  min-height: 100%;
  overflow-x: clip;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const LoadingScreen = styled.div`
  max-height: 100vh;
`;
const OutletWrapper = styled.div`
  min-height: 100vh;
  /* max-width: 1618px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background-color: rgb(253 253 253);
  padding-top: 35px;
  @media (max-width: 68rem) {
    padding-top: 0;
  }
`;
const HeroWrapper = styled.div`
  background-color: white;
  @media (max-width: 68rem) {
    margin-bottom: 25px;
  }
`;
