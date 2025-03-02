'use client';
import { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";
import config from "@/config/config";
const currency = config.currency

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    stripe,
    isCheckoutSubmit,
    clientSecret,
    register,
    errors,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">Your Order</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>Product</h4>
            <h4>Total</h4>
          </li>

          {/*  item list */}
          {cart_products.map((item) => (
            <li key={item._id} className="tp-order-info-list-desc">
              <p>
                {item.title} <span> x {item.orderQuantity}</span>
              </p>
              <span>{currency}{item.price.toFixed(2)}</span>
            </li>
          ))}

          {/*  shipping */}
          {/* <li className="tp-order-info-list-shipping">
            <span>Shipping</span>
            <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Shipping Option is required!`,
                  })}
                  id="flat_shipping"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(60)}
                  htmlFor="flat_shipping"
                >
                  Delivery: Today Cost :<span>{currency}60.00</span>
                </label>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </span>
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Shipping Option is required!`,
                  })}
                  id="flat_rate"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(20)}
                  htmlFor="flat_rate"
                >
                  Delivery: 7 Days Cost: <span>{currency}20.00</span>
                </label>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </span>
            </div>
          </li> */}

           {/*  subtotal */}
           <li className="tp-order-info-list-subtotal">
            <span>Subtotal</span>
            <span>{currency}{total.toFixed(2)}</span>
          </li>

           {/*  shipping cost */}
           <li className="tp-order-info-list-subtotal">
            <span>Shipping Cost</span>
            <span>{currency}{shippingCost.toFixed(2)}</span>
          </li>

           {/* discount */}
           <li className="tp-order-info-list-subtotal">
            <span>Discount</span>
            <span>{currency}{discountAmount.toFixed(2)}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>Total</span>
            <span>{currency}{parseFloat(cartTotal).toFixed(2)}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment">

      {/* UNCOMMENT IT ONCE PAYMENT GATEWAY AVAILABLE */}
        {/* <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            type="radio"
            id="back_transfer"
            name="payment"
            value="Card"
          />
          <label onClick={() => setShowCard(true)} htmlFor="back_transfer" data-bs-toggle="direct-bank-transfer">
            Credit Card
          </label>
          {showCard && (
            <div className="direct-bank-transfer">
              <div className="payment_card">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          <ErrorMsg msg={errors?.payment?.message} />
        </div> */}
        {/* PHONEPAY INTEGRATION */}
        <div className="tp-checkout-payment-item phonepay-option">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            onClick={() => setShowCard(false)}
            type="radio"
            id="phonepay"
            name="payment"
            value="Phonepay"
          />
          <label htmlFor="phonepay" className="phonepay-label">
            <div className="payment-method-content">
              <div className="payment-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48">
                  <path fill="#4527a0" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                  <path fill="#fff" d="M32.267,20.171c0-0.681-0.584-1.264-1.264-1.264h-2.334l-5.35-6.25c-0.486-0.584-1.264-0.778-2.043-0.584l-1.848,0.584c-0.292,0.097-0.389,0.486-0.195,0.681l5.836,5.666h-8.851c-0.292,0-0.486,0.195-0.486,0.486v0.973c0,0.681,0.584,1.506,1.264,1.506h1.972v4.305c0,3.502,1.611,5.544,4.723,5.544c0.973,0,1.378-0.097,2.35-0.486v3.112c0,0.875,0.681,1.556,1.556,1.556h0.786c0.292,0,0.584-0.292,0.584-0.584V21.969h2.812c0.292,0,0.486-0.195,0.486-0.486V20.171z M26.043,28.413c-0.584,0.292-1.362,0.389-1.945,0.389c-1.556,0-2.097-0.778-2.097-2.529v-4.305h4.043V28.413z"></path>
                </svg>
              </div>
              <span className="payment-method-name">PhonePe</span>
            </div>
          </label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
        {/* <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            onClick={() => setShowCard(false)}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
          />
          <label htmlFor="cod">Cash on Delivery</label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div> */}
      </div>

      <div className="tp-checkout-btn-wrapper">
        <div className="checkout-info-message">
          {isCheckoutSubmit ? (
            <p className="processing-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Processing your payment, please wait...
            </p>
          ) : (
            <p className="instruction-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Click once and wait for payment to process
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!stripe || isCheckoutSubmit}
          className="tp-checkout-btn w-100"
        >
          {isCheckoutSubmit ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
