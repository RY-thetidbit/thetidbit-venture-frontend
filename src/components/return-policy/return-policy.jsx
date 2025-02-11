// pages/return-policy.js

import React from 'react';
import Head from 'next/head';

const ReturnPolicy = () => {
  return (
    <>
      <Head>
        <title>Return Policy | TheTidbit</title>
        <meta name="description" content="Read our return policy for hassle-free returns and exchanges on sling bags, handbags, tote bags, and wallets at TheTidbit." />
      </Head>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Return and Refund Policy</h1>
      <p><strong>Last Updated: 10th Jan 2025</strong></p>

      <p>
        Thank you for shopping at <strong>TheTidbit</strong>. If you are not entirely satisfied with your purchase, we are here to help.
      </p>

      <h2>1. Return Timeframe</h2>
      <ul>
        <li>Customers can return or exchange a product within 7 days of receiving it.</li>
        <li>Exchanges are subject to product availability.</li>
        <li>Returned items must be unused and in original condition with all tags intact.</li>
      </ul>

      <h2>2. Refund Processing Timeframe</h2>
      <ul>
        <li>Refunds will be creditedto the original payment method within 7-10 business days after approval.</li>
        <li>Shipping charges (if any) are non-refundable.</li>
      </ul>

      <h2>3. Damaged or Defective Products</h2>
      <ul>
        <li>If the product received is defective or damaged, customers must report it within 48 hours of delivery.</li>
        <li>Photo proof of the damage may be required before processing a replacement or refund.</li>
      </ul>

      <h2>4. Contact Information</h2>
      <p>If you have any questions about our return and refund policy, contact us at:</p>
      <ul>
        <li><strong>Email:</strong> thetidbitcompany@gmail.com</li>
        <li><strong>Phone:</strong> +91 9226740297</li>
        <li><strong>Address:</strong> Ambernath, Thane, Mumbai 421505</li>
      </ul></div>
    </>
  );
};

export default ReturnPolicy;
