// pages/return-policy.js

import React from 'react';
import Head from 'next/head';

const RefundPolicy = () => {
  return (
    <>
      <Head>
        <title>Refund Policy | TheTidbit</title>
        <meta name="description" content="Read our Refund policy for hassle-free returns and exchanges on sling bags, handbags, tote bags, and wallets at TheTidbit." />
      </Head>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Refund Policy</h1>
      <p><strong>Last Updated: 10th Jan 2025</strong></p>

      <p>
        Thank you for shopping at <strong>TheTidbit</strong>. If you are not entirely satisfied with your purchase, we are here to help.
      </p>

      <h2>1. Refund Eligibility</h2>
      <ul>
        <li>Refund requests must be made within 7 days of receiving the product.</li>
        <li>Refunds will only be processed for items returned in their original condition with all tags and packaging intact.</li>
        <li>TheTidbit reserves the right to inspect the returned product before processing a refund.</li>
      </ul>

      <h2>2. Refund Processing Timeframe</h2>
      <ul>
        <li>Refunds will be creditedto the original payment method within 7-10 business days after approval.</li>
        <li>Shipping charges (if any) are non-refundable.</li>
      </ul>

      <h2>3. Damaged or Defective Products</h2>
      <ul>
        <li>If the product received is defective or damaged, customers must report it within 48 hours of delivery.</li>
        <li>We may require photo proof of the damage before processing a replacement or refund.</li>
      </ul>

      <h2>4. Contact Information</h2>
      <p>If you have any questions about our refund policy, contact us at:</p>
      <ul>
        <li><strong>Email:</strong> thetidbitcompany@gmail.com</li>
        <li><strong>Phone:</strong> +91 9226740297</li>
        <li><strong>Address:</strong> Ambernath, Thane, Mumbai 421505</li>
      </ul>
        </div>
    </>
  );
};

export default RefundPolicy;
