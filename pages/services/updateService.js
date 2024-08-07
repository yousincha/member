import axios from "axios";

const updateCart = async (loginInfo, itemId, newQuantity) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/cartItems/${itemId}`,
      { quantity: newQuantity },
      {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("수량 업데이트에 실패하였습니다.", error);
    throw error;
  }
};

export default updateCart;
