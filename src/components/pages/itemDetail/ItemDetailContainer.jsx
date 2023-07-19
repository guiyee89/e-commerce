// import { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { ItemDetail } from "./ItemDetail";
// import { CartContext } from "../../context/CartContext";
// import { db } from "../../../firebaseConfig";
// import { collection, getDoc, doc } from "firebase/firestore";
// import styled from "styled-components/macro";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BarLoader } from "react-spinners";

// export const ItemDetailContainer = () => {
//   //Guardamos los items (objetos)
//   const [selectedItem, setSelectedItem] = useState({});

//   //PROVEEMOS EL "CONTEXTO"
//   const { addToCart } = useContext(CartContext);

//   const { id } = useParams();

//   //Obtener cantidades por ID para pasar la data
//   // const quantityId = getTotalQuantityById(id);

//   //AGREGAMOS PRODUCTOS AL CARRITO
//   const onAdd = (quantity) => {
//     let data = {
//       ...selectedItem,
//       quantity: quantity,
//     };
//      //Agregamos la "data" de los productos con la funcion de contexto
//     addToCart(data);
//     setSelectedItem({ ...selectedItem, quantity: 1 }); //Reset count inicial a 1
//   };

//   //ENCONTRAMOS PRODUCTOS POR "ID" Y RESOLVEMOS PROMISE PARA RENDERIZAR
//   useEffect(() => {
//     const fetchSelectedItem = async () => {
//       // setLoading(true);
//       const itemCollection = collection(db, "products");
//       const refDoc = doc(itemCollection, id); // Use the ID from the URL parameter
//       const docSnapshot = await getDoc(refDoc);

//       if (docSnapshot.exists()) {
//         setSelectedItem({
//           ...docSnapshot.data(),
//           id: docSnapshot.id,
//         });
//       }
//       // setLoading(false);
//     };

//     fetchSelectedItem();
//   }, [id]);
//   return (
//     <>
//       <ToastContainer
//         position="bottom-right"
//         autoClose={1000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//       />
//       {selectedItem.id ? (
//         <ItemDetail
//           selectedItem={selectedItem}
//           onAdd={onAdd}
//           addToCart={addToCart}
//         />
//       ) : (
//         <LoaderWrapper>
//           <BarLoader color="#12352e"  width={250}/>
//         </LoaderWrapper>
//       )}
//     </>
//   );
// };
// const LoaderWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 538px;
//   margin-left: 35px;
// `;
import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ItemDetail } from "./ItemDetail";
import { CartContext } from "../../context/CartContext";
import { db } from "../../../firebaseConfig";
import { collection, getDoc, doc } from "firebase/firestore";
import styled from "styled-components/macro";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarLoader } from "react-spinners";

export const ItemDetailContainer = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(true); // Add the setLoading state
  const { addToCart } = useContext(CartContext);
  const { id } = useParams(); // The ID parameter from the URL
  const { state } = useLocation(); // The state from the location object

  const onAdd = (quantity) => {
    let data = {
      ...selectedItem,
      quantity: quantity,
    };
    addToCart(data);
    setSelectedItem({ ...selectedItem, quantity: 1 });
  };

  useEffect(() => {
    // Check if the selectedItem already exists with the correct ID
    if (selectedItem.id === id) {
      setLoading(false);
      return; // No need to fetch again, we already have the item
    }

    const fetchSelectedItem = async () => {
      setLoading(true);
      const itemCollection = collection(db, "products");
      const refDoc = doc(itemCollection, id);
      const docSnapshot = await getDoc(refDoc);

      if (docSnapshot.exists()) {
        setSelectedItem({
          ...docSnapshot.data(),
          id: docSnapshot.id,
        });
      }
      setLoading(false);
    };

    // Use state.selectedItem.id to check if the state comes from CarouselDesktop
    if (state?.selectedItem?.id === id) {
      setSelectedItem(state.selectedItem);
      setLoading(false);
    } else {
      fetchSelectedItem();
    }
    console.log(id)
    console.log(state)
    console.log(selectedItem)
  }, [id, state, selectedItem]);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {loading ? (
        <LoaderWrapper>
          <BarLoader color="#12352e" width={250} />
        </LoaderWrapper>
      ) : selectedItem ? (
        <ItemDetail
          selectedItem={selectedItem}
          onAdd={onAdd}
          addToCart={addToCart}
        />
      ) : (
        <p>Item not found</p>
      )}
    </>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 538px;
  margin-left: 35px;
`;
