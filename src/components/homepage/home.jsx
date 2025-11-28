import Category from "./category";
import Trustability from "./trustability";
import Banner from "./banner";
import BrandsSection from "./brand";
import ProductsGrid from "./product";
import FlashSale from "./flashsale";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <Category />

      <FlashSale />
      <ProductsGrid />
      <Trustability />

      <BrandsSection />
    </div>
  );
}
