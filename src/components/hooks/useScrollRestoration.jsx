import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  useEffect(() => {
    return () => {
      localStorage.setItem("scrollPosition", window.scrollY.toString());
    };
  }, []);
};

export default useScrollRestoration;


//DEPRECATED
// import { useEffect } from 'react';
// import { withRouter } from 'react-router-dom';

// function useScrollRestoration({ navigate }) {
//   useEffect(() => {
//     const unlisten = navigate.listen(() => {
//       window.scrollTo(0, 0);
//     });
//     return () => {
//       unlisten();
//     }
//   }, []);

//   return (null);
// }

// export default withRouter(useScrollRestoration);
