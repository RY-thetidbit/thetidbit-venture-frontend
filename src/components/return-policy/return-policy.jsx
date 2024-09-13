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
        <h1>Return Policy</h1>
        <p>At <strong>TheTidbit</strong>, we strive to ensure that our customers are fully satisfied with their purchases. If you are not completely happy with your order, you can return the products within 30 days of receipt for a full refund or exchange, subject to the conditions listed below.</p>

        <h2>Eligibility for Returns</h2>
        <ul>
          <li>Items must be returned within 30 days of delivery.</li>
          <li>Products must be in their original condition, unused, and with all tags attached.</li>
          <li>Returns must include the original packaging (dust bags, boxes, etc.) and any accessories or freebies that were part of the purchase.</li>
          <li>Proof of purchase, such as an order number or receipt, must be provided.</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <ul>
          <li>Gift cards, personalized items, or items marked as final sale cannot be returned or exchanged.</li>
          <li>Products that have been used, washed, altered, or damaged by the customer will not be accepted for returns.</li>
        </ul>

        <h2>Return Process</h2>
        <ol>
          <li>Contact our customer support team at <a href="mailto:support@thetidbit.in">support@thetidbit.in</a> to initiate the return process.</li>
          <li>Pack the items securely in the original packaging and include the return form provided with your order.</li>
          <li>Ship the package to our return address:
            <br />
            <strong>TheTidbit Returns Department</strong>
            <br />
            
            Shivshakti Complex
            <br />
            Ambernath, Maharashtra, 421501
            <br />
            India
          </li>
          <li>Once we receive the returned item(s), we will inspect them and notify you of the status of your refund or exchange.</li>
        </ol>

        <h2>Refunds</h2>
        <p>If your return is approved, we will process the refund to your original payment method within 7-10 business days. Please note that it may take additional time for the refund to reflect in your account, depending on your bank or card issuer.</p>

        <h2>Exchanges</h2>
        <p>If you wish to exchange an item for a different size or color, please contact our customer support team. Exchanges are subject to product availability.</p>

        <h2>Shipping Costs</h2>
        <p>Return shipping costs are the responsibility of the customer unless the item received is incorrect or damaged. In such cases, we will cover the return shipping costs.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions or concerns regarding our return policy, please feel free to contact us at <a href="mailto:thetidbitcompany@gmail.com">support@thetidbit.in</a>.</p>
      </div>
    </>
  );
};

export default ReturnPolicy;
