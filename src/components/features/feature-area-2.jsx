'use client';
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Delivery, Discount, Refund, Support } from '@/svg';
import config from "@/config/config";
import amazonLogo from "@assets/img/amazon-available (1).png";
import flipkartLogo from "@assets/img/flipkart.png";
const {currency} =  config

const AmazonImage = ()=><Link href={`https://www.amazon.in/s?me=A141FX4CK0KAZ4&marketplaceID=A21TJRUUN4KGV&ref=v_sp_carousel_all_asins`}>
<Image
  src={amazonLogo}
  width="0"
  height="0"
  sizes="100vw"
  style={{ width: "250px", height: "45px" }}
  alt="product-electronic"
/>
</Link>

const FlipkartImage = ()=><Link href={`https://www.amazon.in/s?me=A141FX4CK0KAZ4&marketplaceID=A21TJRUUN4KGV&ref=v_sp_carousel_all_asins`}>
<Image
  src={flipkartLogo}
  width="0"
  height="0"
  sizes="100vw"
  style={{ width: "250px", height: "45px" }}
  alt="product-electronic"
/>
</Link>

export const feature_data = [
  {
    icon: <Delivery />,
    title: 'Free Delivery',
    subtitle: 'Orders from all item'
  },
  {
    type:"card",
    icon: <AmazonImage />,
    title: 'available on amazon',
    subtitle: 'available on amazon'
  },
  {
    type:"card",
    icon: <FlipkartImage />,
    title: 'available on flipkart',
    subtitle: 'available on flipkart'
  },
  
  // {
  //   icon: <Refund />,
  //   title: 'Return & Refund',
  //   subtitle: 'Moneyback on genuine'
  // },
  // {
  //   icon: <Discount />,
  //   title: 'Member Discount',
  //   subtitle: `Onevery order over ${currency}140.00`
  // },
  {
    icon: <Support />,
    title: 'Support 24/7',
    subtitle: 'Contact us 24 hours a day'
  },
  
]


const FeatureAreaTwo = () => {
  return (
    <section className={`tp-feature-area tp-feature-border-2 pb-80`}>
      <div className="container">
        <div className="tp-feature-inner-2">
          <div className="row align-items-center">
            {feature_data.map((item, i) => (
              <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tp-feature-item-2 d-flex align-items-start mb-40">
                  <div className="tp-feature-icon-2 mr-10">
                    <span>
                      {item.icon}
                    </span>
                  </div>
                  <div className="tp-feature-content-2">
                    <h3 className="tp-feature-title-2">{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaTwo;