// pages/return-policy.js

import React from 'react';
import Head from 'next/head';

const ShippingPolicy = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy | TheTidbit</title>
        <meta name="description" content="Read our Shipping policy for hassle-free returns and exchanges on sling bags, handbags, tote bags, and wallets at TheTidbit." />
      </Head>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <h1>Shipping Policy</h1>
      <p><strong>Last Updated: 10th Jan 2025</strong></p>

      <p>
        Thank you for shopping at <strong>TheTidbit</strong>. Below is our shipping policy to ensure a smooth delivery process for our customers.
      </p>

      <h2>1. Shipping Timeframe</h2>
      <ul>
        <li>We aim to dispatch all orders within the specified time frame mentioned on the product page.</li>
        <li>Standard delivery takes approximately 5-7 business days.</li>
        <li>Express shipping options are available at an additional cost, delivering within 2-3 business days.</li>
        <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
      </ul>

      <h2>2. Shipping Charges</h2>
      <ul>
        <li>Shipping charges are calculated at checkout based on the delivery location and package weight.</li>
        <li>Free shipping may be available for specific orders as per promotional offers.</li>
      </ul>

      <h2>3. Order Tracking</h2>
      <ul>
        <li>Once your order is dispatched, you will receive an email with tracking details.</li>
        <li>You can track your order using the provided tracking number on our courier partner’s website.</li>
      </ul>

      <h2>4. Delivery Issues</h2>
      <ul>
        <li>If your order is delayed beyond the expected timeframe, please contact our support team.</li>
        <li>We are not responsible for delays caused by unforeseen circumstances such as weather, strikes, or customs issues.</li>
      </ul>

      <h2>5. Contact Information</h2>
      <p>If you have any questions about our shipping policy, contact us at:</p>
      <ul>
        <li><strong>Email:</strong> thetidbitcompany@gmail.com</li>
        <li><strong>Phone:</strong> +91 9226740297</li>
        <li><strong>Address:</strong> Ambernath, Thane, Mumbai 421505</li>
      </ul>
      </div>
    </>
  );
};

export default ShippingPolicy;
