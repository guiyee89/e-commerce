import styled from "styled-components/macro";
import { CartWidget } from "../../common/cartWidget/CartWidget";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { SideMenuContext } from "../../context/SideMenuContext";
import CloseIcon from "@mui/icons-material/Close";

export const NavMobile = () => {
  //////////        ////////////        ////////////        ///////////
  //                       CartContext                      //
  const { getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();
  //////////        ////////////        ////////////        ///////////
  //                       SideMenuContext                      //
  const { isMenuOpen, toggleSideMenu } = useContext(SideMenuContext);

  //////////        ////////////        ////////////        ///////////
  //                       Scroll Effect                      //
  const [scroll, setScroll] = useState("not-scrolled");
  //funcion para darle efecto al navbar al scrollear 12% de la pantalla
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.innerHeight * 0.05; // 10% of screen height
      if (window.scrollY > scrollHeight) {
        setScroll("scrolled");
      } else {
        setScroll("not-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //////////        ////////////        ////////////        ///////////
  //                 Reset localStorage on nav links               //
  const handleNavLinkClick = () => {
    localStorage.removeItem("selectedFilters");
    localStorage.removeItem("currentPage");
    if (!isMenuOpen) {
      toggleSideMenu();
    }
  };

  return (
    <>
    {/*   <TransparentDiv
        isMenuOpen={isMenuOpen}
        onClick={isMenuOpen ? null : toggleSideMenu}
      /> */}
      <Nav scrolled={scroll}>
        <InsideNav>
          <MenuIcon
            onClick={toggleSideMenu}
            sx={{ fontSize: "40px", marginLeft: "24px", marginTop: "8px" }}
          />
          <TransparentDiv
            isMenuOpen={isMenuOpen}
            onClick={isMenuOpen ? null : toggleSideMenu}
          />
          <SideMenuWrapper isMenuOpen={isMenuOpen}>
            <SideMenuHeader>
              <LogoSideMenu onClick={handleNavLinkClick}>
                <LogoLink to="/">
                  <LogoMenu src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"></LogoMenu>
                </LogoLink>
              </LogoSideMenu>
              <CloseIcon
                onClick={toggleSideMenu}
                sx={{
                  fontSize: "35px",
                  marginTop: "15px",
                  marginLeft: "36px",
                  cursor: "pointer",
                }}
              />
            </SideMenuHeader>
            <NavListWrapper>
              <NavList>
                <NavLink to="/" scrolled={scroll} onClick={handleNavLinkClick}>
                  home
                </NavLink>
              </NavList>
              <NavList>
                <NavLink
                  to="/all-products"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  products
                </NavLink>
              </NavList>
              <NavList>
                <NavLink
                  to="/category/shoes"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  shoes
                </NavLink>
              </NavList>
              <NavList>
                <NavLink
                  to="/category/pants"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  pants
                </NavLink>
              </NavList>
              <NavList>
                <NavLink
                  to="/category/shirts"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  shirts
                </NavLink>
              </NavList>
            </NavListWrapper>
          </SideMenuWrapper>

          <LogoDiv scrolled={scroll} onClick={handleNavLinkClick}>
            <LogoLink to="/">
              <Logo src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"></Logo>
            </LogoLink>
          </LogoDiv>

          <CartWidget
            scrolled={scroll}
            sx={{ padding: "10px" }}
            totalItems={totalItems}
          />
        </InsideNav>
      </Nav>
    </>
  );
};
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "100%")};
  background-color: ${({ isMenuOpen }) =>
    isMenuOpen ? "none" : "rgba(0, 0, 0, 0.2)"};
  z-index: ${({ isMenuOpen }) => (isMenuOpen ? "-1" : "1")};
`;
const SideMenuWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isMenuOpen }) => (isMenuOpen ? "-420px" : "0")};
  width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "85%")};
  transition: ${({ isMenuOpen }) =>
    isMenuOpen ? "0.3s ease-in-out" : "0.3s ease-in-out"};
  z-index: 2;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  @media screen and (min-width: 500px) {
    width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "60%")};
  }
`;
const SideMenuHeader = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 0px 15px 15px 65px;
  margin-top: 15px;
  justify-content: flex-end;
  border-bottom: 1px solid lightgrey;
`;

const Nav = styled.nav`
  height: ${(props) => (props.scrolled === "scrolled" ? "65px" : "90px")};
  transition: height
    ${(props) => (props.scrolled === "scrolled" ? "0.16s" : "0.16s")}
    ease-in-out;
  margin: 0 auto;
  display: flex;
  position: fixed;
  z-index: 1;
  background-color: rgb(253 253 253);
  box-shadow: ${(props) =>
    props.scrolled === "scrolled" ? "none" : "rgba(0, 0, 0, 0.55) 0px 0px 3px"};
  border-bottom: ${(props) =>
    props.scrolled === "scrolled"
      ? "1px solid rgb(133 132 132 / 25%)"
      : "none"};
`;
const InsideNav = styled.div`
  width: 100vw;
  max-width: 1548px;
  display: flex;
  margin: 0px auto;
  padding: 0px 20px 0 20px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;
const LogoDiv = styled.div`
  width: ${(props) => (props.scrolled === "scrolled" ? "90px" : "110px")};
  transition: width
    ${(props) => (props.scrolled === "scrolled" ? "0.20s" : "0.16s")}
    ease-in-out;
`;
const LogoLink = styled(Link)`
  text-decoration: none;
`;
const Logo = styled.img`
  width: 52%;
  margin-left: 20px;
`;
const LogoSideMenu = styled.div`
  width: 100%;
`;
const LogoMenu = styled.img`
  width: 50px;
  margin: 5px auto;
`;
const NavListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.7rem;
  margin-top: 40px;
`;
const NavList = styled.li`
  padding: 0 20px;
`;
const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  position: relative;
  font-size: ${(props) =>
    props.scrolled === "scrolled" ? ".75rem" : "0.82rem"};
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: #fafafa;
    transition: background-color 0.05s ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.21s ease-in-out;
  }
`;