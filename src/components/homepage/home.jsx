import Category from "./category";
import ProductCard from "./product";
import Trustability from "./trustability";
import { useProductStore } from "../store/productstore";
import { useEffect } from "react";
import Banner from "./banner";
import BrandsSection from "./brand";
import ProductsGrid from "./product";
import ProductsSection from "./product";
export default function Home() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <BrandsSection />
      <Category />
      <ProductsSection />
      <ProductsGrid />
      <Trustability />
    </div>
  );
}
