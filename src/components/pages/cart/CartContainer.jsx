import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { db } from "../../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

export const CartContainer = () => {
  
  const {
    cart,
    clearCart,
    removeQuantity,
    removeById,
    getTotalPrice,
    getItemPrice,
    addQuantity,
  } = useContext(CartContext);

  const totalPrice = getTotalPrice();

  const navigate = useNavigate();

  const realizarCompra = async () => {
    let isValid = true;

    for (const product of cart) {
      const productRef = doc(db, "products", product.id);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        // Producto no existe en Firebase
        isValid = false;
        break;
      }

      const productData = productSnapshot.data();
      if (product.quantity > productData.stock) {
        // Cantidad de producto en localStorage excede el stock en Firebase
        isValid = false;
        break;
      }
    }

    if (isValid) {
      navigate("/Checkout");
    } else {
      // Ya no hay stock de productos
      alert("Some items in your cart are no longer available.");
      clearCart();
    }
  };

  return (
    <Wrapper key="cart-wrapper">
      {/* Boton para limpiar "cart" */}
      {cart.map((product) => {
        //Buscar item x id en la funcion getItemPrice
        const itemPrice = getItemPrice(product.id);

        return (
          <ItemWrapper key={product.id}>
            <ImgWrapper>
              <ItemImg src={product.img} alt="" />
            </ImgWrapper>

            <ItemTitle>{product.title}</ItemTitle>

            <ItemPrice>${itemPrice}</ItemPrice>

            <QuantityWrapper>
              <BtnQuantity onClick={() => removeQuantity(product.id)}>
                {" "}
                -{" "}
              </BtnQuantity>
              <ItemQuantity>{product.quantity}</ItemQuantity>
              <BtnQuantity
                onClick={() => addQuantity(product.id)}
                disabled={product.stock === product.quantity}
              >
                {" "}
                +{" "}
              </BtnQuantity>
            </QuantityWrapper>

            <BtnDelete onClick={() => removeById(product.id)}>Delete</BtnDelete>
          </ItemWrapper>
        );
      })}
      <CartInfo>
        {cart.length > 0 ? (
          <>
            <button onClick={clearCart}>Clear all</button>
            <TotalPago>Total a Pagar: $ {totalPrice}</TotalPago>
            <button onClick={realizarCompra}>Checkout</button>
          </>
        ) : (
          <h1>The cart is empty</h1>
        )}
      </CartInfo>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: center;
  margin: 100px;
  gap: 1rem;
`;
const ItemWrapper = styled.div`
  display: flex;
  height: 150px;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: rgba(0, 0, 0, 0.65) 0px 0px 5px;
`;
const ImgWrapper = styled.div`
  height: 200px;
  width: 200px;
  display: flex;
  align-items: center;
`;
const QuantityWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;
const ItemImg = styled.img`
  width: 100%;
  height: 70%;
  object-fit: contain;
`;
const ItemQuantity = styled.h4``;
const ItemPrice = styled.h3``;
const ItemTitle = styled.h2`
  width: 100px;
`;
const BtnQuantity = styled.button`
  width: 30px;
`;
const BtnDelete = styled.button`
  width: fit-content;
`;
const CartInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 1.5rem;
`;
const TotalPago = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
`;
