// pages/return-policy.js

import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | TheTidbit</title>
        <meta name="description" content="Read our Privacy policy for hassle-free returns and exchanges on sling bags, handbags, tote bags, and wallets at TheTidbit." />
      </Head>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated: 10th Jan 2025</strong></p>

      <p>
        Welcome to <strong>TheTidbit</strong>. We are committed to protecting your privacy and ensuring your personal information is handled securely.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Personal details such as name, email address, phone number, and shipping address.</li>
        <li>Payment details when you make a purchase.</li>
        <li>Browsing behavior, cookies, and preferences to enhance user experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process orders and deliver products.</li>
        <li>To provide customer support and respond to inquiries.</li>
        <li>To send promotional emails and updates (you may opt-out at any time).</li>
        <li>To improve our website functionality and user experience.</li>
      </ul>

      <h2>3. Data Protection</h2>
      <ul>
        <li>We implement industry-standard security measures to protect your data.</li>
        <li>Your personal information is not shared with third parties except for order fulfillment.</li>
      </ul>

      <h2>4. Cookies</h2>
      <ul>
        <li>Our website uses cookies to enhance user experience and track site usage.</li>
        <li>You can manage cookie preferences through your browser settings.</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <ul>
        <li>We may use third-party services for payment processing and analytics.</li>
        <li>These third parties have their own privacy policies governing data usage.</li>
      </ul>

      <h2>6. Your Rights</h2>
      <ul>
        <li>You have the right to access, modify, or delete your personal information.</li>
        <li>To request changes, contact us using the details below.</li>
      </ul>

      <h2>7. Contact Information</h2>
      <p>If you have any questions about our privacy policy, contact us at:</p>
      <ul>
        <li><strong>Email:</strong> thetidbitcompany@gmail.com</li>
        <li><strong>Phone:</strong> +91 9226740297</li>
        <li><strong>Address:</strong> Ambernath, Thane, Mumbai 421505</li>
      </ul>
        </div>
    </>
  );
};

export default PrivacyPolicy;
