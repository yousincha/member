// import axios from "axios";

// const cancelCart = async (loginInfo, itemIds) => {
//   try {
//     // Ensure itemIds is an array
//     if (!Array.isArray(itemIds)) {
//       throw new TypeError("itemIds must be an array");
//     }
//     const response = await axios.delete(
//       "http://localhost:8080/cartItems/cancelCartItems",
//       {
//         headers: {
//           Authorization: `Bearer ${loginInfo.accessToken}`,
//         },
//         params: {
//           itemIds: itemIds.join(), // join the array to create a comma-separated string
//         },
//       }
//     );

//     if (response.status === 200) {
//       return "상품이 장바구니에서 삭제되었습니다.";
//     }
//     throw new Error("상품 삭제에 실패했습니다.");
//   } catch (error) {
//     console.error("장바구니 상품 삭제 중 오류 발생:", error);
//     throw new Error("상품 삭제 중 오류가 발생했습니다.");
//   }
// };

// export default cancelCart;
import axios from "axios";

const cancelCart = async (loginInfo, itemIds) => {
  if (!loginInfo) {
    throw new Error("로그인 정보가 없습니다.");
  }

  try {
    if (!Array.isArray(itemIds)) {
      throw new TypeError("itemIds must be an array");
    }

    const response = await axios.post(
      "http://localhost:8080/cartItems/cancelCartItems",
      { itemIds: itemIds },
      {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return "상품이 장바구니에서 삭제되었습니다.";
    } else {
      throw new Error(`상품 삭제 실패: ${response.statusText}`);
    }
  } catch (error) {
    console.error("장바구니 상품 삭제 중 오류 발생:", error);
    throw new Error(`상품 삭제 중 오류가 발생했습니다: ${error.message}`);
  }
};

export default cancelCart;
