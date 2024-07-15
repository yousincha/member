import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";

const useStyles = {
  container: {
    marginTop: 24,
  },
  productCard: {
    marginBottom: 24,
  },
  media: {
    height: 0,
    paddingTop: "150%",
  },
  gridContainer: {
    justifyContent: "left",
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: "20px",
    fontWeight: "bold",
    width: "100px",
    marginBottom: 24,
    color: "#333",
    "&:hover": {
      backgroundColor: "#d0d0d0",
    },
  },
  sortContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // 정렬 기준 버튼과 총 상품 수량을 양 옆에 정렬
    marginBottom: 16,
  },
  sortButton: {
    height: "auto",
    padding: "8px 16px", // Adjust padding as needed
    fontSize: "1rem", // Adjust font size as needed
  },
  totalProductsText: {
    fontSize: "1rem", // Match font size with button for alignment
  },
};
const ProductList = ({
  categories,
  products,
  pageNumber,
  totalPages,
  categoryId,
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("default"); // 초기 값은 "default"로 설정
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

        if (!loginInfo || !loginInfo.accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        const cartResponse = await axios.get("http://localhost:8080/carts", {
          params: { memberId: loginInfo.memberId },
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          withCredentials: true,
        });

        if (cartResponse.data.length > 0) {
          setCartItems(cartResponse.data);
          setMemberId(loginInfo.memberId);
        } else {
          console.log("장바구니가 생성되지 않았습니다.");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    setTotalProducts(products.length);
  }, [products]);

  const handleAddToCart = async (product) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      if (!product.id) {
        console.error("상품 ID가 유효하지 않습니다.");
        return;
      }

      let cartId = null;
      if (cartItems.length > 0) {
        cartId = cartItems[0].id;
      } else {
        const cartResponse = await axios.post(
          "http://localhost:8080/carts",
          { memberId: loginInfo.memberId },
          {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
            withCredentials: true,
          }
        );
        cartId = cartResponse.data.id;
        setCartItems([cartResponse.data]);
      }

      const AddCartItemDto = {
        cartId: cartId,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productDescription: product.description,
        quantity: 1,
      };

      setCartItems((prevCartItems) => {
        const existingCartItem = prevCartItems.find(
          (item) => item.productId === product.id
        );
        if (existingCartItem) {
          return prevCartItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCartItems, AddCartItemDto];
        }
      });

      const response = await axios.post(
        "http://localhost:8080/cartItems",
        AddCartItemDto,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
          withCredentials: true,
        }
      );

      const updatedCartItem = response.data;
      setCartItems((prevCartItems) => {
        const existingCartItemIndex = prevCartItems.findIndex(
          (item) => item.productId === updatedCartItem.productId
        );
        if (existingCartItemIndex !== -1) {
          const updatedCartItems = [...prevCartItems];
          updatedCartItems[existingCartItemIndex] = updatedCartItem;
          return updatedCartItems;
        } else {
          return [...prevCartItems, updatedCartItem];
        }
      });

      alert("장바구니에 상품이 추가되었습니다.");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortOption = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "priceHighToLow") {
      return b.price - a.price;
    } else if (sortOption === "priceLowToHigh") {
      return a.price - b.price;
    } else if (sortOption === "name") {
      return a.title.localeCompare(b.title);
    } else {
      return 0;
    }
  });

  // 정렬 기준 버튼 텍스트를 동적으로 설정합니다.
  const getSortButtonText = () => {
    if (sortOption === "priceHighToLow") {
      return "가격 높은 순";
    } else if (sortOption === "priceLowToHigh") {
      return "가격 낮은 순";
    } else if (sortOption === "name") {
      return "이름 순";
    } else {
      return "정렬 기준";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container style={useStyles.container}>
        <Grid container spacing={2}>
          <Grid item>
            <Link href={`/products`} passHref>
              <Button style={useStyles.categoryButton}>모두</Button>
            </Link>
          </Grid>
          {categories.map((category) => (
            <Grid item key={category.id}>
              <Link href={`/products?categoryId=${category.id}`} passHref>
                <Button style={useStyles.categoryButton}>
                  {category.name}
                </Button>
              </Link>
            </Grid>
          ))}
        </Grid>

        <Box style={useStyles.sortContainer} marginBottom={2}>
          <Typography
            variant="body1"
            component="div"
            style={useStyles.totalProductsText}
          >
            총 상품 수량: {totalProducts}
          </Typography>
          <Box>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleSortClick}
              style={useStyles.sortButton}
            >
              {getSortButtonText()} {/* 동적으로 표시될 버튼 텍스트 */}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={sortAnchorEl}
              keepMounted
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => handleSortOption("priceHighToLow")}>
                가격 높은 순
              </MenuItem>
              <MenuItem onClick={() => handleSortOption("priceLowToHigh")}>
                가격 낮은 순
              </MenuItem>
              <MenuItem onClick={() => handleSortOption("name")}>
                이름 순
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Grid container spacing={3} style={useStyles.gridContainer}>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => {
              const cartItem = cartItems.find(
                (item) => item.productId === product.id
              );

              return (
                <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
                  <Card style={useStyles.productCard}>
                    <CardMedia
                      style={useStyles.media}
                      image={product.imageUrl}
                      title={product.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.price}원
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cartItem
                          ? `장바구니 담긴 수량: ${cartItem.quantity}`
                          : "장바구니에 담아보세요"}{" "}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleAddToCart(product)}
                      >
                        장바구니 담기
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
                height: "500px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" component="div">
                해당 카테고리에 상품이 없습니다.
              </Typography>
            </Grid>
          )}
        </Grid>
        <Box display="flex" justifyContent="center" marginBottom={3}>
          <Link
            href={`/products?page=0${
              categoryId ? `&categoryId=${categoryId}` : ""
            }`}
            passHref
          >
            <Button variant="outlined">첫페이지</Button>
          </Link>
          <Link
            href={`/products?page=${Math.max(0, pageNumber - 1)}${
              categoryId ? `&categoryId=${categoryId}` : ""
            }`}
            passHref
          >
            <Button variant="outlined">이전</Button>
          </Link>
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              href={`/products?page=${i}${
                categoryId ? `&categoryId=${categoryId}` : ""
              }`}
              passHref
              key={i}
            >
              <Button variant="outlined" selected={i === pageNumber}>
                {i + 1}
              </Button>
            </Link>
          ))}
          <Link
            href={`/products?page=${Math.min(totalPages - 1, pageNumber + 1)}${
              categoryId ? `&categoryId=${categoryId}` : ""
            }`}
            passHref
          >
            <Button variant="outlined">다음</Button>
          </Link>
          <Link
            href={`/products?page=${totalPages - 1}${
              categoryId ? `&categoryId=${categoryId}` : ""
            }`}
            passHref
          >
            <Button variant="outlined">마지막페이지</Button>
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export async function getServerSideProps(context) {
  const categoryId = context.query.categoryId || 0;
  const page = context.query.page || 0;

  let categories = [];
  let products = [];
  let pageNumber = 0;
  let totalPages = 0;

  try {
    const categoryResponse = await axios.get(
      "http://localhost:8080/categories"
    );
    categories = categoryResponse.data;
    const productResponse = await axios.get("http://localhost:8080/products", {
      params: {
        categoryId,
        page,
      },
    });
    products = productResponse.data.content;
    pageNumber = parseInt(productResponse.data.pageable.pageNumber);
    totalPages = parseInt(productResponse.data.totalPages);
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return {
    props: {
      categories,
      products,
      pageNumber,
      totalPages,
      categoryId,
    },
  };
}

export default ProductList;
