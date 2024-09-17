'use client';
import React, { useEffect } from "react";
import Head from 'next/head'; // Importing Head to dynamically set meta tags
import PrdDetailsLoader from "../loader/prd-details-loader";
import ErrorMsg from "../common/error-msg";
import ProductDetailsBreadcrumb from "../breadcrumb/product-details-breadcrumb";
import { useGetProductQuery } from "@/redux/features/productApi";
import ProductDetailsContent from "./product-details-content";

const ProductDetailsArea = ({ id }) => {
  const { data: product, isLoading, isError } = useGetProductQuery(id);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Thetidbit.in`; // Dynamically set the title
    }
  }, [product]);

  let content = null;

  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />;
  } 
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  } 
  if (!isLoading && !isError && product) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.category.name} title={product.title} />
        <ProductDetailsContent productItem={product} />
      </>
    );
  }
  return (
    <>
      <Head>
        <meta name="description" content={product ? `Buy ${product.title} at Thetidbit.` : "Product details on Thetidbit."} />
      </Head>
      {content}
    </>
  );
};

export default ProductDetailsArea;
