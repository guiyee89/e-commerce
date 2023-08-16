import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { css } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const MultiFilter = ({ items, onFilterChange }) => {
  //////////           ////////////           ////////////           ///////////           ///////////
  //                       STATE FOR DIFFERENT FILTERS                        //
  const [detailsFilters, setDetailsFilters] = useState({
    category: "",
    size: "",
    color: "",
    orderBy: "",
  });

  //////////           ////////////           ////////////           ///////////           ///////////
  //      MAPING COLORS, SIZE, CATEGORIES AND QUANTITY FOR EACH FILTER        //

  //-------    COLOR MAPING   -------//
  const uniqueColors = Array.from(new Set(items.map((item) => item.color))); //Find all the colors
  // const colorUserMap = {}; //Track unique colors
  // items.forEach((item) => {
  //   if (!colorUserMap[item.color]) {
  //     // Iterate through the items to populate the colorUserMap
  //     colorUserMap[item.color] = new Set();
  //   }
  //   colorUserMap[item.color].add(item.userId); // Add the "userId" property to set that color
  // });

  // const colorQuantityMap = {}; // Create a colorQuantityMap. Filter quantity of color by "userId" of items
  // Object.keys(colorUserMap).forEach((color) => {
  //   const userSet = colorUserMap[color];
  //   colorQuantityMap[color] = userSet.size;
  // });

  //-------    SIZE MAPING   -------//
  const uniqueSizes = Array.from(new Set(items.map((item) => item.size)));
  // const sizeUserMap = {};
  // items.forEach((item) => {
  //   if (!sizeUserMap[item.size]) {
  //     sizeUserMap[item.size] = new Set();
  //   }
  //   sizeUserMap[item.size].add(item.userId);
  // });

  // const sizeQuantityMap = {};
  // Object.keys(sizeUserMap).forEach((size) => {
  //   const userSet = sizeUserMap[size];
  //   sizeQuantityMap[size] = userSet.size;
  // });

  //-------    CATEGORY MAPING   -------//
  const uniqueCategory = Array.from(
    new Set(items.map((item) => item.category))
  );
  const categoryUserMap = {};
  items.forEach((item) => {
    if (!categoryUserMap[item.category]) {
      categoryUserMap[item.category] = new Set();
    }
    categoryUserMap[item.category].add(item.userId);
  });

  //////////           ////////////           ////////////           ///////////           ///////////
  //                             FILTERING LOGIC FOR ALL ITEMS                            //
  const { categoryName } = useParams();

  //Fetch items from Firestore Database and filter accordingly on selection
  const fetchFilteredItems = async () => {
    try {
      const filteredCollection = collection(db, "products");
      console.log("fetching MultiFilter...");
      let queryFilters = [];
      if (categoryName) {
        queryFilters.push(where("category", "==", categoryName));
      }
      if (detailsFilters.category.length > 0) {
        queryFilters.push(where("category", "in", detailsFilters.category));
      }
      if (detailsFilters.size.length > 0) {
        queryFilters.push(where("size", "in", detailsFilters.size));
      }
      if (detailsFilters.color.length > 0) {
        queryFilters.push(where("color", "in", detailsFilters.color));
      }

      const filteredQuery = query(filteredCollection, ...queryFilters);
      const querySnapshot = await getDocs(filteredQuery);

      // Use a Set to track unique userId-color combinations
      const uniqueItems = new Set();
      const filteredItems = querySnapshot.docs.reduce((filtered, doc) => {
        const item = doc.data();
        const key = `${item.userId}-${item.color}`;

        if (!uniqueItems.has(key)) {
          uniqueItems.add(key);
          filtered.push({
            id: doc.id,
            ...item,
          });
        }

        return filtered;
      }, []);

      let orderedItems = [...filteredItems];

      // Apply the ordering logic
      if (detailsFilters.orderBy === "discount") {
        orderedItems = orderedItems.filter(
          (item) => item.discount !== undefined
        );
      } else if (detailsFilters.orderBy === "lowPrice") {
        orderedItems.sort((a, b) => {
          const priceA = "discountPrice" in a ? a.discountPrice : a.price;
          const priceB = "discountPrice" in b ? b.discountPrice : b.price;
          return priceA - priceB;
        });
      } else if (detailsFilters.orderBy === "highPrice") {
        orderedItems.sort((a, b) => {
          const priceA = "discountPrice" in a ? a.discountPrice : a.price;
          const priceB = "discountPrice" in b ? b.discountPrice : b.price;
          return priceB - priceA;
        });
      }
      console.log(orderedItems);

      onFilterChange(orderedItems, detailsFilters);
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    }
  };

  //ORDER BY - filtering logic according if filtered items or original items are being rendered
  useEffect(() => {
    setTimeout(() => {
      if (
        detailsFilters.category.length === 0 &&
        detailsFilters.size.length === 0 &&
        detailsFilters.color.length === 0
      ) {
        // If no filters are applied, order the original items by the selected ordering option
        let orderedItems = [...items];
        if (detailsFilters.orderBy === "discount") {
          orderedItems = orderedItems.filter(
            (item) => item.discount !== undefined
          );
        } else if (detailsFilters.orderBy === "lowPrice") {
          orderedItems.sort((a, b) => {
            const priceA = "discountPrice" in a ? a.discountPrice : a.price;
            const priceB = "discountPrice" in b ? b.discountPrice : b.price;
            return priceA - priceB;
          });
        } else if (detailsFilters.orderBy === "highPrice") {
          orderedItems.sort((a, b) => {
            const priceA = "discountPrice" in a ? a.discountPrice : a.price;
            const priceB = "discountPrice" in b ? b.discountPrice : b.price;
            return priceB - priceA;
          });
        }
        onFilterChange(orderedItems, detailsFilters);
      } else {
        // If filters are applied, fetch and order filtered items
        fetchFilteredItems();
      }
    }, 700);
  }, [detailsFilters]);

  //////////           ////////////           ////////////           ///////////           ///////////
  //                                 HANDLE FILTERED ITEMS                                //
  const [loadingDetail, setLoadingDetail] = useState(false);

  //Handle each filter change and pass the values
  const handleDetailsFilterChange = (filterName, value) => {
    setDetailsFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Helper function to update filter array
  const updateFilterArray = (array, value, add) => {
    if (add) {
      return [...array, value];
    }
    return array.filter((item) => item !== value);
  };

  //////////        /////////       /////////
  //------         LOADER           ------//
  const handleLoadDetail = () => {
    setLoadingDetail(true);
    setTimeout(() => {
      setLoadingDetail(false);
    }, 850);
  };

  //Reset filters
  const handleReset = () => {
    setTimeout(() => {
      setDetailsFilters((prevFilters) => ({
        ...prevFilters,
        category: [],
        size: [],
        color: [],
        orderBy: [],
      }));
    }, 710);
  };

  //////////           ////////////           ////////////           ///////////           ///////////
  //                           MANAGING FILTERS BY localStorage                           //
  // Load selected filters from localStorage when the component mounts
  useEffect(() => {
    const storedFilters = localStorage.getItem("selectedFilters");
    if (storedFilters) {
      setDetailsFilters(JSON.parse(storedFilters));
    }
  }, []);

  // Update localStorage when the detailsFilters state changes
  useEffect(() => {
    localStorage.setItem("selectedFilters", JSON.stringify(detailsFilters));
  }, [detailsFilters]);

  //////////           ////////////           ////////////           ///////////           ///////////
  return (
    <>
      <FilterHeader>
        <FilterBy>Filters</FilterBy>
        <ResetButton
          onClick={() => {
            handleReset();
            handleLoadDetail();
          }}
        >
          Clear filters
        </ResetButton>
      </FilterHeader>
      <FilterWrapper>
        {/* Loader Circle */}
        <Loader>
          {loadingDetail && <ClipLoader color="#194f44" size={60} />}
        </Loader>

        {/* General filter */}
        <Accordion defaultExpanded sx={styles.expandedAccordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: "bold",
                marginLeft: "22px",
                fontSize: "1.1rem",
                color: "#555454",
              }}
            >
              Order by
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <OrderByWrapper>
                  <OrderByBtn
                    active={detailsFilters.orderBy === ""}
                    onClick={() => {
                      handleDetailsFilterChange("orderBy", "");
                      handleLoadDetail();
                    }}
                  >
                    No order
                  </OrderByBtn>
                  <OrderByBtn
                    active={detailsFilters.orderBy === "discount"}
                    onClick={() => {
                      handleDetailsFilterChange("orderBy", "discount");
                      handleLoadDetail();
                    }}
                  >
                    Discount Only
                  </OrderByBtn>
                  <OrderByBtn
                    active={detailsFilters.orderBy === "lowPrice"}
                    onClick={() => {
                      handleDetailsFilterChange("orderBy", "lowPrice");
                      handleLoadDetail();
                    }}
                  >
                    Lower Price
                  </OrderByBtn>
                  <OrderByBtn
                    active={detailsFilters.orderBy === "highPrice"}
                    onClick={() => {
                      handleDetailsFilterChange("orderBy", "highPrice");
                      handleLoadDetail();
                    }}
                  >
                    Higher Price
                  </OrderByBtn>
                </OrderByWrapper>
              }
            />
          </AccordionDetails>
        </Accordion>

        {/* CATEGORY FILTER */}
        <Accordion defaultExpanded sx={styles.expandedAccordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: "bold",
                marginLeft: "22px",
                fontSize: "1.1rem",
                color: "#555454",
              }}
            >
              Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {uniqueCategory.map((category, index) => (
              <FormControlLabel
                key={index}
                sx={{
                  ...selectStyle,
                  marginBottom: "-3px",
                  textTransform: "capitalize",
                  marginTop: "0px;",
                }}
                control={
                  <Checkbox
                    sx={{
                      color: "#202932",
                      "&.Mui-checked": {
                        color: "black",
                      },
                    }}
                    onClick={() => handleLoadDetail()}
                    checked={detailsFilters.category.includes(category)}
                    onChange={(e) =>
                      handleDetailsFilterChange(
                        "category",
                        updateFilterArray(
                          detailsFilters.category,
                          category,
                          e.target.checked
                        )
                      )
                    }
                  />
                }
                label={category}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* SIZE FILTER */}
        <Accordion defaultExpanded sx={styles.expandedAccordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                minWidth: "112px",
                fontWeight: "bold",
                marginLeft: "22px",
                fontSize: "1.1rem",
                color: "#555454",
              }}
            >
              Sizes
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={0}>
              {uniqueSizes
                .sort((a, b) => {
                  const sizeOrder = { xs: 1, s: 2, m: 3, l: 4, xl: 5 };
                  const aOrder = sizeOrder[a] || parseInt(a, 10) || 9999;
                  const bOrder = sizeOrder[b] || parseInt(b, 10) || 9999;
                  return aOrder - bOrder;
                })
                .map((size, index) => (
                  <Grid item xs={6} key={index}>
                    <CheckboxWrapper>
                      <StyledCheckboxLabel>
                        <StyledCheckboxInput
                          type="checkbox"
                          checked={detailsFilters.size.includes(size)}
                          onClick={() => handleLoadDetail()}
                          onChange={(e) =>
                            handleDetailsFilterChange(
                              "size",
                              updateFilterArray(
                                detailsFilters.size,
                                size,
                                e.target.checked
                              )
                            )
                          }
                        />
                        {size}
                      </StyledCheckboxLabel>
                    </CheckboxWrapper>
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* COLOR FILTER */}
        <Accordion defaultExpanded sx={styles.expandedAccordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: "bold",
                marginLeft: "22px",
                fontSize: "1.1rem",
                color: "#555454",
              }}
            >
              Colors
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Use the Grid container */}
              {uniqueColors.map((color, index) => (
                <Grid item xs={6} key={index}>
                  {/* Divide the grid into 2 columns */}
                  <FormControlLabel
                    sx={{
                      ...selectStyle,
                      marginBottom: "15px",
                      textTransform: "capitalize",
                    }}
                    control={
                      <Checkbox
                        sx={{
                          color: "#202932",
                          minWidth: "55px",
                          marginRight: "-10px",
                          "&.Mui-checked": {
                            color: "black",
                          },
                        }}
                        checked={detailsFilters.color.includes(color)}
                        onClick={() => handleLoadDetail()}
                        onChange={(e) =>
                          handleDetailsFilterChange(
                            "color",
                            updateFilterArray(
                              detailsFilters.color,
                              color,
                              e.target.checked
                            )
                          )
                        }
                      />
                    }
                    label={color}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </FilterWrapper>
    </>
  );
};

// import { useEffect, useState } from "react";
// import styled from "styled-components/macro";
// import Select from "@mui/material/Select";
// import {
//   Checkbox,
//   FormControl,
//   InputLabel,
//   ListItemText,
//   MenuItem,
//   OutlinedInput,
// } from "@mui/material";

// export const MultiFilter = ({ items, onFilterChange }) => {
//   //////////           ////////////           ////////////           ///////////           ///////////
//   //                       STATE FOR DIFFERENT FILTERS                        //
//   const [detailsFilters, setDetailsFilters] = useState({
//     category: "",
//     size: "",
//     color: "",
//     orderBy: "",
//   });

//   //////////           ////////////           ////////////           ///////////           ///////////
//   //      MAPING COLORS, SIZE, CATEGORIES AND QUANTITY FOR EACH FILTER        //

//   //-------    COLOR MAPING   -------//
//   const uniqueColors = Array.from(new Set(items.map((item) => item.color))); //Find all the colors
//   const colorUserMap = {}; //Track unique colors
//   items.forEach((item) => {
//     if (!colorUserMap[item.color]) {
//       // Iterate through the items to populate the colorUserMap
//       colorUserMap[item.color] = new Set();
//     }
//     colorUserMap[item.color].add(item.userId); // Add the "userId" property to set that color
//   });

//   const colorQuantityMap = {}; // Create a colorQuantityMap. Filter quantity of color by "userId" of items
//   Object.keys(colorUserMap).forEach((color) => {
//     const userSet = colorUserMap[color];
//     colorQuantityMap[color] = userSet.size;
//   });

//   //-------    SIZE MAPING   -------//
//   const uniqueSizes = Array.from(new Set(items.map((item) => item.size)));
//   const sizeUserMap = {};
//   items.forEach((item) => {
//     if (!sizeUserMap[item.size]) {
//       sizeUserMap[item.size] = new Set();
//     }
//     sizeUserMap[item.size].add(item.userId);
//   });

//   // const sizeQuantityMap = {};
//   // Object.keys(sizeUserMap).forEach((size) => {
//   //   const userSet = sizeUserMap[size];
//   //   sizeQuantityMap[size] = userSet.size;
//   // });

//   //-------    CATEGORY MAPING   -------//
//   const uniqueCategory = Array.from(
//     new Set(items.map((item) => item.category))
//   );
//   const categoryUserMap = {};
//   items.forEach((item) => {
//     if (!categoryUserMap[item.category]) {
//       categoryUserMap[item.category] = new Set();
//     }
//     categoryUserMap[item.category].add(item.userId);
//   });

//   //////////           ////////////           ////////////           ///////////           ///////////
//   //                     FILTERING LOGIC FOR ALL ITEMS                       //
//   const applyDetailsFilters = (items, filters) => {
//     let filteredItems = items;

//     if (filters.category && filters.category.length > 0) {
//       // category
//       filteredItems = filteredItems.filter((item) =>
//         filters.category.includes(item.category)
//       );
//     }
//     if (filters.size && filters.size.length > 0) {
//       //size
//       filteredItems = filteredItems.filter((item) =>
//         filters.size.includes(item.size)
//       );
//     }
//     if (filters.color && filters.color.length > 0) {
//       // color
//       filteredItems = filteredItems.filter((item) =>
//         filters.color.includes(item.color)
//       );
//     }
//     if (filters.orderBy === "discount") {
//       //discount
//       filteredItems = filteredItems.filter(
//         (item) => item.discount !== undefined
//       );
//     }
//     if (filters.orderBy === "lowPrice") {
//       //lower price
//       filteredItems.sort((a, b) => {
//         const priceA = "discountPrice" in a ? a.discountPrice : a.price;
//         const priceB = "discountPrice" in b ? b.discountPrice : b.price;
//         return priceA - priceB;
//       });
//     } else if (filters.orderBy === "highPrice") {
//       //higher price
//       filteredItems.sort((a, b) => {
//         const priceA = "discountPrice" in a ? a.discountPrice : a.price;
//         const priceB = "discountPrice" in b ? b.discountPrice : b.price;
//         return priceB - priceA;
//       });
//     }
//     return filteredItems;
//   };

//   //////////           ////////////           ////////////           ///////////           ///////////
//   //                         HANDLE FILTERED ITEMS                        //
//   const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

//   //Handle each filter change and pass the values
//   const handleDetailsFilterChange = (filterName, value) => {
//     setDetailsFilters((prevFilters) => ({
//       ...prevFilters,
//       [filterName]: value,
//     }));
//     setHasAppliedFilters(false);
//   };

//   //Apply filters. Pass the value to ItemList component -> onFilterChange
//   useEffect(() => {
//     if (hasAppliedFilters) {
//       return;
//     }
//     const filteredItems = applyDetailsFilters(items, detailsFilters);
//     onFilterChange(filteredItems, detailsFilters);
//     setHasAppliedFilters(true);
//   }, [detailsFilters, items, hasAppliedFilters, onFilterChange]);

//   // Load selected filters from localStorage when the component mounts
//   useEffect(() => {
//     const storedFilters = localStorage.getItem("selectedFilters");
//     if (storedFilters) {
//       setDetailsFilters(JSON.parse(storedFilters));
//       setHasAppliedFilters(false); // Reset the applied filters status
//     }
//   }, []);

//   // Update localStorage when the detailsFilters state changes
//   useEffect(() => {
//     localStorage.setItem("selectedFilters", JSON.stringify(detailsFilters));
//   }, [detailsFilters]);

//   //////////           ////////////           ////////////           ///////////           ///////////
//   return (
//     <>
//       <FilterWrapper>
//         <FilterBy>Filter by :</FilterBy>

//         {/* Category filter */}
//         <FormControl sx={mainStyle}>
//           <InputLabel
//             id="category-select-label"
//             sx={{
//               paddingLeft: "10px",
//               fontSize: "1.1rem",
//               "&.Mui-focused": {
//                 color: "#b26507",
//               },
//             }}
//           >
//             Categories
//           </InputLabel>
//           <Select
//             sx={{
//               ...selectStyle,
//               "&.Mui-focused": {
//                 borderBottomColor: "black",
//                 textTransform: "capitalize",
//               },
//             }}
//             MenuProps={MenuProps}
//             multiple
//             labelId="category-select-label"
//             id="category-select"
//             value={detailsFilters.category || []}
//             onChange={(e) =>
//               handleDetailsFilterChange("category", e.target.value)
//             }
//             input={<OutlinedInput label="Categories" />}
//             renderValue={(selected) => selected.join(", ")}
//           >
//             {uniqueCategory.map((category, index) => (
//               <MenuItem key={index} value={category}>
//                 <Checkbox
//                   checked={detailsFilters.category.includes(category)}
//                 />
//                 <ListItemText
//                   sx={{ textTransform: "capitalize" }}
//                   primary={category}
//                 />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Sizes filter */}
//         <FormControl sx={mainStyle}>
//           <InputLabel
//             id="size-select-label"
//             sx={{
//               paddingLeft: "25px",
//               fontSize: "1.1rem",
//               "&.Mui-focused": {
//                 color: "#b26507", // Change to your desired color
//               },
//             }}
//           >
//             Sizes
//           </InputLabel>
//           <Select
//             sx={{
//               ...selectStyle,
//               "&.Mui-focused": {
//                 borderBottomColor: "black",
//                 textTransform: "capitalize",
//               },
//             }}
//             MenuProps={MenuProps}
//             labelId="size-select-label"
//             id="size-select"
//             multiple
//             value={detailsFilters.size || []} // Ensure detailsFilters.size is an array
//             onChange={(e) => handleDetailsFilterChange("size", e.target.value)}
//             input={<OutlinedInput label="Sizes" />}
//             renderValue={(selected) => selected.join(", ")}
//           >
//             {uniqueSizes
//               .sort((a, b) => {
//                 // Custom sorting logic to order sizes as desired
//                 const sizeOrder = { xs: 1, s: 2, m: 3, l: 4, xl: 5 };
//                 const aOrder = sizeOrder[a] || parseInt(a, 10) || 9999;
//                 const bOrder = sizeOrder[b] || parseInt(b, 10) || 9999;
//                 return aOrder - bOrder;
//               })
//               .map((size, index) => (
//                 <MenuItem key={index} value={size}>
//                   <Checkbox checked={detailsFilters.size.includes(size)} />
//                   <ListItemText
//                     primary={size}
//                     sx={{ textTransform: "uppercase" }}
//                   />
//                 </MenuItem>
//               ))}
//           </Select>
//         </FormControl>

//         {/* Color filter */}
//         <FormControl sx={mainStyle}>
//           <InputLabel
//             id="color-select-label"
//             sx={{
//               fontSize: "1.1rem",
//               paddingLeft: "25px",
//               "&.Mui-focused": {
//                 color: "#b26507",
//               },
//             }}
//           >
//             Colors
//           </InputLabel>
//           <Select
//             sx={{
//               ...selectStyle,
//               "&.Mui-focused": {
//                 borderBottomColor: "black",
//                 textTransform: "capitalize",
//               },
//             }}
//             MenuProps={MenuProps}
//             labelId="color-select-label"
//             id="color-select"
//             multiple
//             value={detailsFilters.color || []} // Ensure detailsFilters.color is an array
//             onChange={(e) => handleDetailsFilterChange("color", e.target.value)}
//             input={<OutlinedInput label="Colors" />}
//             renderValue={(selected) => selected.join(", ")}
//           >
//             {uniqueColors.map((color, index) => (
//               <MenuItem key={index} value={color}>
//                 <Checkbox checked={detailsFilters.color.includes(color)} />
//                 <ListItemText
//                   sx={{ textTransform: "capitalize" }}
//                   primary={`${color} (${colorQuantityMap[color] || 0})`}
//                 />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </FilterWrapper>

//       {/* General filter */}

//       <FormControl sx={orderStyle}>
//         <InputLabel
//           id="order-by-select-label"
//           sx={{
//             fontSize: "1.1rem",
//             fontWeight: "bold",
//             paddingLeft: "10px",
//             color: "black",
//             "&.Mui-focused": {
//               color: "#b26507",
//             },
//           }}
//         >
//           Order by
//         </InputLabel>
//         <Select
//           labelId="order-by-select-label"
//           id="order-by-select"
//           value={detailsFilters.orderBy || ""}
//           onChange={(e) => handleDetailsFilterChange("orderBy", e.target.value)}
//           input={<OutlinedInput label="Order by" />}
//           sx={{
//             ...selectStyle,
//             "&.Mui-focused": {
//               borderBottomColor: "black",
//               textTransform: "capitalize",
//             },
//           }}
//         >
//           <MenuItem value="">No order</MenuItem>
//           <MenuItem value="discount">Discount Only</MenuItem>
//           <MenuItem value="lowPrice">Lower Price</MenuItem>
//           <MenuItem value="highPrice">Higher Price</MenuItem>
//         </Select>
//       </FormControl>
//     </>
//   );
// };

//MATERIAL UI STYLES

const FilterHeader = styled.div`
  display: flex;
  width: 90%;
  -webkit-box-pack: center;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: 1px solid lightgray;
`;
const FilterBy = styled.p`
  font-weight: bold;
  margin-right: 25px;
`;
const ResetButton = styled.button`
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  background-color: transparent;
  margin-right: -25px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 7%;
    width: 90%;
    height: 2px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 68%;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 1px solid lightgrey;
  /* Customize the scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f6f6f6;
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 25%;
  left: 71%;
  z-index: 1;
`;
const styles = {
  expandedAccordion: css`
    margin: 0px 14px 0 24px !important;
    border-top: 1px solid lightgray;
    box-shadow: none;
  `,
};
const selectStyle = {
  m: 1,
  height: 35,
  width: 100,
};
const OrderByWrapper = styled.div`
  width: 69%;
  margin-left: 18px;
`;
const OrderByBtn = styled.button`
  width: 100%;
  text-align: inherit;
  border-radius: 3%;
  margin-bottom: 5px;
  padding: 5px;
  color: black;
  font-size: 0.85rem;
  background-color: ${(props) => (props.active ? "#dbe4f5" : "#f4f4f4")};
  border: ${(props) =>
    props.active ? "1px solid black" : "1px solid lightgrey"};
  font-weight: ${(props) => (props.active ? "600" : "normal")};
`;
const CheckboxWrapper = styled.div`
  margin-left: 24px;
`;
const StyledCheckboxLabel = styled.label`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-left: 8px;
  margin-right: 36px;
  margin-bottom: 25px;
  text-transform: uppercase;
  justify-content: space-around;
`;
const StyledCheckboxInput = styled.input`
  width: 46px;
  height: 36px;
  border-radius: 13%;
  background-color: transparent;
  border: 2px solid rgb(191 194 198);
  appearance: none;
  outline: none;
  position: absolute;

  cursor: pointer;
  &:checked {
    border-width: 0.2rem;
    border-color: black;
  }
`;
