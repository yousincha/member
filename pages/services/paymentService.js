import axios from "axios";

const requestPay = async (loginInfo, itemsInfo) => {
  const { IMP } = window;
  IMP.init("imp07380687");
  const totalPrice = calculateTotalSum(itemsInfo);

  return new Promise((resolve, reject) => {
    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: new Date().getTime(),
        name: "테스트 상품",
        amount: totalPrice,
        buyer_email: "test@gmail.com",
        buyer_name: "cozy",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시",
        buyer_postcode: "123-456",
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
