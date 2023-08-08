import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components/macro";


export const MultiFilter = ({ items, onFilterChange }) => {
  
  const [detailsFilters, setDetailsFilters] = useState({
    category:"",
    size: "",
    color: "",
    discount: "",
  });
  const { categoryName } = useParams();
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);


  const applyDetailsFilters = (items, filters) => {
    let filteredItems = items;
    if (filters.size) {
      filteredItems = filteredItems.filter(
        (item) => item.size === filters.size
      );
    }
    if (filters.color) {
      filteredItems = filteredItems.filter(
        (item) => item.color === filters.color
      );
    }
    if (filters.discount === "discount") {
      filteredItems = filteredItems.filter(
        (item) => item.discount !== undefined
      );
    }
    if(filters.category) {
      filteredItems = filteredItems.filter(
        (item) => item.category === filters.category
      )
    }
    return filteredItems;
  };


  const handleDetailsFilterChange = (filterName, value) => {
    setDetailsFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setHasAppliedFilters(false);
  };


  useEffect(() => {
    if (hasAppliedFilters) {
      return;
    }
    const filteredItems = applyDetailsFilters(items, detailsFilters);
    onFilterChange(filteredItems, detailsFilters);
    setHasAppliedFilters(true);
  }, [detailsFilters, items, hasAppliedFilters, onFilterChange]);

 

  return (
    <>
      <FilterWrapper>
        <FilterBy>Filter by :</FilterBy>
        {/* Size filter */}
        {categoryName === "shoes" ? (
          <FilterDetailsBtn
            value={detailsFilters.size}
            onChange={(e) => handleDetailsFilterChange("size", e.target.value)}
          >
            <option value="">All Shoe Sizes</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
          </FilterDetailsBtn>
        ) : categoryName === "pants" || categoryName === "shirts" ? (
          // For "pants" and "shirts" categories, render string sizes options
          <FilterDetailsBtn
            value={detailsFilters.size}
            onChange={(e) => handleDetailsFilterChange("size", e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="xs">XS</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
          </FilterDetailsBtn>
        ) : (
          // For "all products" and when categoryName is not defined, render both options
          <>
            {/* Category filter */}
            <FilterDetailsBtn
              value={detailsFilters.category}
              onChange={(e) =>
                handleDetailsFilterChange("category", e.target.value)
              }
            >
              <option value="">All Categories</option>
              <option value="pants">Pants</option>
              <option value="shirts">Shirts</option>
              <option value="shoes">Shoes</option>
            </FilterDetailsBtn>
            {/* Numeric sizes */}
            <FilterDetailsBtn
              value={detailsFilters.size}
              onChange={(e) =>
                handleDetailsFilterChange("size", e.target.value)
              }
            >
              <option value="">All Shoe Sizes</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
            </FilterDetailsBtn>

            {/* String sizes */}
            <FilterDetailsBtn
              value={detailsFilters.size}
              onChange={(e) =>
                handleDetailsFilterChange("size", e.target.value)
              }
            >
              <option value="">All Sizes</option>
              <option value="xs">XS</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </FilterDetailsBtn>
          </>
        )}

        {/* Color filter */}
        <FilterDetailsBtn
          value={detailsFilters.color}
          onChange={(e) => handleDetailsFilterChange("color", e.target.value)}
        >
          <option value="">All Colors</option>
          <option value="white">White</option>
          <option value="grey">Grey</option>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </FilterDetailsBtn>
      </FilterWrapper>
      {/* Discount filter */}

      <GeneralFilterBtn
        value={detailsFilters.discount}
        onChange={(e) => handleDetailsFilterChange("discount", e.target.value)}
      >
        <option value="">Order by</option>
        <option value="discount">Discount</option>
      </GeneralFilterBtn>
    </>
  );
};


const FilterWrapper = styled.div`
  display: flex;
  width: 65%;
  max-width: 800px;
`;
const FilterDetailsBtn = styled.select`
  margin: 0 10px;
  border: 1px #c6bdbd solid;
  border-top: none;
  border-left: none;
  width: 130px;
  margin: 0px 16px;
  border-bottom-right-radius: 8px;
  justify-content: center;
  background-color: rgb(243, 239, 239);
`;

const GeneralFilterBtn = styled.select`
  border-right: 1px solid rgb(198, 189, 189);
  border-bottom: 1px solid rgb(198, 189, 189);
  border-image: initial;
  border-top: none;
  border-left: none;
  width: 134px;
  margin: 0px 30px;
  border-bottom-right-radius: 8px;
  font-weight: 600;
  background-color: rgb(243, 239, 239);
`;
const FilterBy = styled.p`
  font-weight: bold;
  margin-right: 10px;
  min-width: 78px;
`;
