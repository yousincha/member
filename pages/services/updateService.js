// import axios from "axios";

// const updateCart = async (loginInfo, itemId, newQuantity) => {
//   try {
//     const response = await axios.put(
//       `http://localhost:8080/cartItems/${itemId}`,
//       { quantity: newQuantity },
//       {
//         headers: {
//           Authorization: `Bearer ${loginInfo.accessToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("수량 업데이트에 실패하였습니다.", error);
//     throw error;
//   }
// };

// export default updateCart;
import axios from "axios";

const updateCart = async (loginInfo, itemId, newQuantity) => {
  if (!loginInfo) {
    throw new Error("로그인 정보가 없습니다.");
  }

  if (
    typeof itemId !== "number" ||
    typeof newQuantity !== "number" ||
    newQuantity <= 0
  ) {
    throw new Error("Invalid itemId or newQuantity");
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/cartItems/updateCartItem",
      { itemId, newQuantity },
      {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return "상품 수량이 업데이트되었습니다.";
    } else {
      throw new Error(`수량 업데이트 실패: ${response.statusText}`);
    }
  } catch (error) {
    console.error("장바구니 상품 수량 업데이트 중 오류 발생:", error);
    throw new Error(`수량 업데이트 중 오류가 발생했습니다: ${error.message}`);
  }
};

export default updateCart;
