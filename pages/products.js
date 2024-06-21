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
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

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
    justifyContent: "center",
  },
};
const ProductList = ({
  categories,
  products,
  pageNumber,
  totalPages,
  categoryId,
}) => {
  const [cartItems, setCartItems] = useState([]); // 장바구니 정보를 상태로 관리
  const [memberId, setMemberId] = useState(""); // memberId 상태 관리

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const loginInfo = JSON.parse(localStorage.getItem("loginInfo")); // 로컬 스토리지에서 로그인 정보 가져오기

        if (!loginInfo || !loginInfo.accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        const cartResponse = await axios.get("http://localhost:8080/carts", {
          params: { memberId: loginInfo.memberId }, // memberId를 쿼리 파라미터로 전달
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`, // 토큰을 헤더에 추가
          },
          withCredentials: true, // withCredentials 옵션 추가
        });

        if (cartResponse.data.length > 0) {
          const userCartItems = cartResponse.data;
          setCartItems(userCartItems); // 장바구니 데이터 설정
          setMemberId(loginInfo.memberId); // memberId 설정
        } else {
          console.log("장바구니 데이터가 비어 있습니다.");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData(); // 컴포넌트가 마운트될 때 한 번 실행
  }, []);
  const handleAddToCart = async (product) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo")); // 로컬 스토리지에서 로그인 정보 가져오기

    if (!loginInfo || !loginInfo.accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 상품 객체에서 productId가 null이 아닌지 확인
      if (!product.id) {
        console.error("상품 ID가 유효하지 않습니다.");
        return;
      }
      // memberId에 해당하는 첫 번째 장바구니 아이템의 id를 cartId로 설정
      const cartId = cartItems.length > 0 ? cartItems[0].id : null;
      if (!cartId) {
        console.error("회원의 장바구니를 찾을 수 없습니다.");
        return;
      }

      // 장바구니에 추가할 상품 정보 설정
      const AddCartItemDto = {
        cartId: cartId,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productDescription: product.description,
        quantity: 1,
      };
      console.log("AddCartItemDto:", AddCartItemDto);

      // 서버에 POST 요청을 보내어 장바구니에 상품 추가
      const response = await axios.post(
        "http://localhost:8080/cartItems",
        AddCartItemDto,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`, // 토큰을 헤더에 추가
          },
          withCredentials: true, // withCredentials 옵션 추가
        }
      );

      console.log("Added to cart:", response.data);
      alert("장바구니에 상품이 추가되었습니다.");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Container style={useStyles.container}>
      <Grid container spacing={3}>
        <Grid item>
          <Link href={`/products`} passHref>
            <Button>모두</Button>
          </Link>
        </Grid>
        {categories.map((category) => (
          <Grid item key={category.id}>
            <Link href={`/products?categoryId=${category.id}`} passHref>
              <Button>{category.name}</Button>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} style={useStyles.gridContainer}>
        {products.length > 0 ? (
          products.map((product, index) => (
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
          ))
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
    // 카테고리 데이터 가져오기
    const categoryResponse = await axios.get(
      "http://localhost:8080/categories"
    );
    categories = categoryResponse.data;
    // 상품 데이터 가져오기
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
