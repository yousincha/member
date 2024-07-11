import axios from "axios";

const cancelCart = async (loginInfo, selectedItems) => {
  try {
    const response = await axios.delete(
      "http://localhost:8080/cartItems/cancelCartItems",
      {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
        params: { itemIds: selectedItems.join() }, // 배열을 문자열로 변환하여 전달
      }
    );

    if (response.status === 200) {
      return "상품이 장바구니에서 삭제되었습니다.";
    } else {
      throw new Error("상품 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("장바구니 상품 삭제 중 오류 발생:", error);
    throw new Error("상품 삭제 중 오류가 발생했습니다.");
  }
};

export default cancelCart;
