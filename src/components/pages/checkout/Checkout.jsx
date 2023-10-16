import { TextField } from "@mui/material";
import { useContext } from "react";
import styled from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import { Wallet } from "@mercadopago/sdk-react";

export const Checkout = ({
  handleSubmit,
  handleChange,
  errors,
  handleBuy,
  preferenceId,
}) => {
  const { cart, getTotalPrice, getItemPrice, getTotalDiscount, getSubTotal } =
    useContext(CartContext);

  const total = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();

  return (
    <>
      <Wrapper>
        <FormItems>
          <FormWrapper>
            <Form onSubmit={handleSubmit}>
              <Input
                label="Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                helperText={errors.name}
                error={errors.name ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                helperText={errors.email}
                error={errors.email ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={handleChange}
                helperText={errors.phone}
                error={errors.phone ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Ciudad / Localidad"
                variant="outlined"
                name="ciudad"
                onChange={handleChange}
                helperText={errors.ciudad}
                error={errors.ciudad ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Direccion - Casa / Departamento"
                variant="outlined"
                name="direccion"
                onChange={handleChange}
                helperText={errors.direccion}
                error={errors.direccion ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Codigo Postal"
                variant="outlined"
                name="cp"
                onChange={handleChange}
                helperText={errors.cp}
                error={errors.cp ? true : false}
                sx={{ marginTop: "14px" }}
              />
            </Form>
          </FormWrapper>

          <ProductsWrapper key="cart-wrapper">
            <ProductTable>
              <thead style={{ borderBottom: "1px solid lightgrey" }}>
                <tr>
                  <th style={{ textAlign: "center", paddingLeft: "45px" }}>
                    Product
                  </th>
                  <th style={{ paddingBottom: "8px" }}>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => {
                  const itemPrice = getItemPrice(product.id);
                  const hasDiscount = product.discountPrice;
                  return (
                    <tr key={product.id}>
                      <ItemWrapper>
                        <ImgWrapper>
                          <ItemImg src={product.img[0]} alt="" />
                        </ImgWrapper>
                        <ItemTitle>{product.title}</ItemTitle>
                      </ItemWrapper>

                      {hasDiscount ? (
                        <ItemPriceWrapper hasDiscount={hasDiscount}>
                          {hasDiscount && (
                            <Price hasDiscount={hasDiscount}>
                              $ {itemPrice.toFixed(2)}
                            </Price>
                          )}

                          <DiscountPrice>
                            ${" "}
                            {(product.discountPrice * product.quantity).toFixed(
                              2
                            )}
                          </DiscountPrice>
                        </ItemPriceWrapper>
                      ) : (
                        <>
                          <PriceWrapper>
                            <Price>$ {itemPrice.toFixed(2)}</Price>
                          </PriceWrapper>
                        </>
                      )}
                      <ItemQuantity>{product.quantity}</ItemQuantity>
                    </tr>
                  );
                })}
              </tbody>
            </ProductTable>
          </ProductsWrapper>
        </FormItems>
        <TotalButton>
          <TotalPriceInfo>
            <SubTotalWrapper>
              <TotalText colSpan="1">Subtotal:</TotalText>
              <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
            </SubTotalWrapper>
            <DiscountWrapper>
              <TotalText colSpan="1">Discount:</TotalText>
              <TotalDiscount>- $ {totalDiscount.toFixed(2)}</TotalDiscount>
            </DiscountWrapper>
            <TotalWrapper>
              <TotalText colSpan="1">Total:</TotalText>
              <TotalPrice>$ {total.toFixed(2)}</TotalPrice>
            </TotalWrapper>
          </TotalPriceInfo>
          <ConfirmMercadoPago>
            <SubmitBtn type="submit" onClick={handleSubmit}>
              Confirm Purchase
            </SubmitBtn>
            {preferenceId && (
              <Wallet
                initialization={{ preferenceId, redirectMode: "modal" }}
              />
            )}
          </ConfirmMercadoPago>
        </TotalButton>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
`;
const FormItems = styled.div`
  display: flex;
`;
const ItemQuantity = styled.td`
  vertical-align: middle;
`;
const FormWrapper = styled.div`
  position: relative;
  width: 600px;
  border-right: 2px solid lightgray;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 100px;
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;
const SubmitBtn = styled.button`
  width: 190px;
  height: 42px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  background-color: black;
  color: white;
  margin-top: 24px;
`;
const ProductsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 0 115px 0 20px;
`;
const ProductTable = styled.table`
  text-align: center;
  margin-bottom: 40px;
`;
const ItemWrapper = styled.td`
  display: flex;
  align-items: center;
  padding-top: 8px;
  height: 70px;
`;
const ItemTitle = styled.h2`
  margin: 0 auto;
`;
const ImgWrapper = styled.div`
  height: 100%;
`;
const ItemImg = styled.img`
  width: 50px;
  height: 100%;
  object-fit: contain;
`;
const PriceWrapper = styled.td`
  vertical-align: middle;
`;
const ItemPriceWrapper = styled.td`
  vertical-align: middle;
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 1rem;
  font-style: italic;
  position: relative;
  padding-right: 2px;
  text-align: center;
  display: block;
`;
const Price = styled.span`
  font-weight: 600;
  font-size: ${(props) => (props.hasDiscount ? "0.8rem" : "1rem")};
  font-style: italic;
  position: relative;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 52%;
    left: 0;
    width: 102%;
    height: 1px;
    background-color: black;
  }
`;
const TotalPriceInfo = styled.div`
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TotalWrapper = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  display: flex;
  justify-content: space-between;
`;
const SubTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DiscountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TotalText = styled.h3`
  text-align: end;
  font-weight: 600;
`;
const TotalDiscount = styled.h3`
  font-weight: 500;
  padding-left: 24px;
`;
const SubTotal = styled.h3`
  font-weight: 500;
  padding-left: 35px;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: 1.7rem;
  padding-left: 46px;
`;
const TotalButton = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-evenly;
  margin: 40px 0 0 42px;
`;
const ConfirmMercadoPago = styled.div`
  display: flex;
  flex-direction: column;
`;
