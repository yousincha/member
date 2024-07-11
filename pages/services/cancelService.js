import axios from "axios";

const cancelCart = async (loginInfo, selectedItems) => {
  try {
    const response = await axios.delete(
      "http://localhost:8080/cartItems/cancelCartItems",
      {
        data: { itemIds: selectedItems },
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return "상품이 장바구니에서 삭제되었습니다.";
    } else {
      throw new Error("상품 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error while deleting items from cart:", error);
    throw new Error("상품 삭제 중 오류가 발생했습니다.");
  }
};

export default cancelCart;
