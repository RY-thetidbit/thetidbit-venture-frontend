import axios from 'axios';

const createPaymentIntentPhonePay = async (data) => {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/order/create-payment-intent-phonePay', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data; // Handle the response
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error; // Handle the error
  }
};

export default createPaymentIntentPhonePay;
