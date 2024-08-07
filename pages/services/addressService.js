// const loadDaumPostcodeScript = () => {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src =
//       "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Daum Postcode script loading failed"));
//     document.head.appendChild(script);
//   });
// };

// const addressInfo = async () => {
//   try {
//     await loadDaumPostcodeScript();

//     return new Promise((resolve) => {
//       const postcode = new window.daum.Postcode({
//         oncomplete: (data) => {
//           const { zonecode: postalCode, address } = data;
//           resolve({ postalCode, address });
//         },
//       });
//       postcode.open();
//     });
//   } catch (error) {
//     console.error("Failed to load Daum Postcode script", error);
//     throw new Error("주소를 가져오는 데 실패했습니다.");
//   }
// };

// export default addressInfo;
// addressInfo.js
import { useEffect, useState } from "react";

const useAddressInfo = () => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDaumPostcodeScript = () => {
      if (typeof window === "undefined") {
        return Promise.reject(new Error("Window is not defined"));
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Daum Postcode script loading failed"));
        document.head.appendChild(script);
      });
    };

    const fetchAddressInfo = async () => {
      try {
        await loadDaumPostcodeScript();

        return new Promise((resolve) => {
          const postcode = new window.daum.Postcode({
            oncomplete: (data) => {
              const { zonecode: postalCode, address } = data;
              resolve({ postalCode, address });
            },
          });
          postcode.open();
        });
      } catch (err) {
        console.error("Failed to load Daum Postcode script", err);
        setError("주소를 가져오는 데 실패했습니다.");
      }
    };

    fetchAddressInfo().then((info) => {
      if (info) {
        setAddress(info);
      }
    });
  }, []);

  return { address, error };
};

export default useAddressInfo;
