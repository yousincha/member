import axios from "axios";

const requestPay = async (
  loginInfo,
  itemsInfo,
  calculateTotalSum,
  calculateTotalPrice,
  pg,
  recipientName,
  recipientPhone,
  address,
  postalCode
) => {
  const { IMP } = window;
  IMP.init("imp07380687");
  const totalPrice = calculateTotalSum(itemsInfo);
  const buyerTel = `${recipientPhone.part1}-${recipientPhone.part2}-${recipientPhone.part3}`;
  const productName = itemsInfo
    .map((item) => item.productDescription)
    .join(", ");

  return new Promise((resolve, reject) => {
    IMP.request_pay(
      {
        pg: pg,
        pay_method: "card",
        merchant_uid: new Date().getTime(),
        name: productName,
        amount: totalPrice,
        buyer_name: recipientName,
        buyer_tel: buyerTel,
        buyer_addr: address,
        buyer_postcode: postalCode,
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            const response = await axios.get(
              `http://localhost:8080/paymentInfos/${rsp.imp_uid}`,
              {
                params: rsp, // rsp 객체를 쿼리 매개변수로 전달
              }
            );
            console.log(rsp.imp_uid);
            if (rsp.paid_amount === response.data.paid_amount) {
              resolve("결제 성공");
              // 결제 성공 시, 서버에 삭제 요청
              await axios.delete(
                "http://localhost:8080/cartItems/deleteAfterPayment",
                {
                  data: itemsInfo.map((item) => item.id),
                  headers: {
                    Authorization: `Bearer ${loginInfo.accessToken}`,
                  },
                }
              );
            } else {
              reject("결제 실패: 금액 불일치");
            }
          } catch (error) {
            console.error("Error while verifying payment:", error);
            reject("결제 실패: 서버 오류");
          }
        } else {
          reject(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  });
};

export default requestPay;
