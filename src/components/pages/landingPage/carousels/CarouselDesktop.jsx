import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const CarouselDesktop = () => {

  const [discountedProducts, setDiscountedProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("discount", "!=", null),
        orderBy("discount"),
        limit(8)
      );

      const querySnapshot = await getDocs(q);
      const productIds = querySnapshot.docs.map((doc) => doc.id); // Obtener docs by ID
      const products = await Promise.all(productIds.map((productId) => fetchDiscountedItemById(productId))); // Fetch cada discounted Item x ID
      setDiscountedProducts(products);
    };
    fetchDiscountedProducts();
  }, []);

  // Function to fetch the discounted item by ID from Firestore
  const fetchDiscountedItemById = async (itemId) => {
    const itemDocRef = doc(db, "products", itemId);
    const itemDocSnapshot = await getDoc(itemDocRef);

    if (itemDocSnapshot.exists()) {
      return { ...itemDocSnapshot.data(), id: itemDocSnapshot.id }; // Include the document ID in the data
    } else {
      return null;
    }
  };

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <Wrapper>
       {loading ? (
        <LoaderWrapper>
          <ClipLoader color="#194f44" size={80} />
        </LoaderWrapper>
      ) : (
        <StyledCarousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={5200}
          //wrap={false}
        >
          <CarouselItem>
            <CarouselInner>
              {discountedProducts.slice(0, 4).map((product) => (
                <ItemWrapper key={product.id}>
                  {/* Pass the product.id as an argument to handleItemCardClick */}
                  <LinkWrapper to={`/item-details/${product.id}`}>
                    <ItemCard>
                      <CarouselImg
                        className="d-block w-100"
                        src={product.img}
                        alt={product.title}
                      />
                      <Discount>-{product.discount}%</Discount>
                      <InfoWrapper>
                        <ItemTitle>{product.title}</ItemTitle>
                        <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                        <ItemPrice hasDiscount={"discount" in product}>
                          <DiscountPrice>
                            $ {product.discountPrice}
                          </DiscountPrice>{" "}
                          ${product.price}
                        </ItemPrice>
                      </InfoWrapper>
                    </ItemCard>
                  </LinkWrapper>
                </ItemWrapper>
              ))}
            </CarouselInner>
          </CarouselItem>

          <CarouselItem>
            <CarouselInner>
              {discountedProducts.slice(4, 8).map((product) => (
                <ItemWrapper key={product.id}>
                  {/* Pass the product.id as an argument to handleItemCardClick */}
                  <LinkWrapper to={`/item-details/${product.id}`}>
                    <ItemCard>
                      <CarouselImg
                        className="d-block w-100"
                        src={product.img}
                        alt={product.title}
                      />
                      <Discount>-{product.discount}%</Discount>
                      <InfoWrapper>
                        <ItemTitle>{product.title}</ItemTitle>
                        <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                        <ItemPrice hasDiscount={"discount" in product}>
                          <DiscountPrice>
                            $ {product.discountPrice}
                          </DiscountPrice>{" "}
                          ${product.price}
                        </ItemPrice>
                      </InfoWrapper>
                    </ItemCard>
                  </LinkWrapper>
                </ItemWrapper>
              ))}
            </CarouselInner>
          </CarouselItem>
        </StyledCarousel>
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin: 24px auto 110px;
  z-index: 0;
  position: relative;
  max-height: 520px;

  @media (max-width: 48rem) {
    max-height: 320px;
    min-height: 200px;
  }
`;
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 230px;
 
`;
const StyledCarousel = styled(Carousel)`
  max-width: 1308px;
  height: 435px;
  .carousel-slide {
    min-height: 300px;
    max-height: 520px;
    @media (max-width: 48rem) {
      height: 320px;
      min-height: 200px;
    }
  }
  .carousel-control-next-icon,
  .carousel-control-prev-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.85);
  }
  .carousel-control-next {
    width: 6%;
    right: -35px;
    bottom: 100px;
  }
  .carousel-control-prev {
    width: 6%;
    left: -35px;
    bottom: 100px;
  }
  .carousel-indicators [data-bs-target] {
    margin-right: 15px;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    background-color: #000000;
  }
  .carousel-indicators {
    bottom: -50px;
  }
  .carousel-inner {
    overflow: hidden;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.55, 0.09, 0.68, 0.53);
  }
`;

const CarouselItem = styled(Carousel.Item)`
  height: 100%;
  .carousel-item {
    position: relative;
    display: none;
    float: left;
    width: 100%;
    margin-right: -100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transition: 0.6s ease-in-out;
  }
`;
const CarouselImg = styled.img`
  margin: 0 auto;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;
  mix-blend-mode: darken;

  @media (min-width: 68.75rem) {
    height: 100%;
    min-height: 200px;
  }
  @media (max-width: 68.75rem) {
    min-width: 200px;
    height: 100%;
  }
`;
const CarouselInner = styled.div`
  max-width: 100%;
  display: flex;
  gap: 1rem;
`;
const ItemWrapper = styled.div`
  //esto ajusta el responsivnes junto con 100% del itemCard
  max-height: 440px;
  max-width: 315px;
`;
const LinkWrapper = styled(Link)`
  text-decoration: none;
`;
const ItemCard = styled.div`
  color: black;
  background-color: rgb(239 237 237);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  margin-bottom: 8px;
  justify-content: center;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 5px;
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0px 8px 22px;
  background-color: rgb(239 237 237);
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 1rem;
  font-style: italic;
  padding: 6px 0 8px 0;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: 16px;
    width: 100%;
    left: 67px;
    border-top: 0.1rem solid rgb(75, 73, 73);
  }
`;
const ItemPrice = styled.h4`
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  font-weight: 600;
  font-size: 1rem;
  font-style: italic;
  padding: 6px 0 8px 0;
`;
const Discount = styled.h4`
  position: absolute;
  top: 10px;
  left: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #b34646;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 2.8;
  cursor: pointer;
`;
const ItemTitle = styled.h2`
  font-size: 0.9rem;
  color: black;
  font-weight: 700;
  word-spacing: 3px;
  text-transform: uppercase;
`;
const ItemSubTitle = styled.h3`
  font-size: 0.8rem;
`;
