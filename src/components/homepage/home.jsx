import Category from "./category";
import Trustability from "./trustability";
import Banner from "./banner";
import BrandsSection from "./brand";
import ProductsGrid from "./product";
import FlashSale from "./flashsale";
import AdditionalContent from "./additionalcontent";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Banner />
      <Category />

      <AdditionalContent />

      <FlashSale />
      <ProductsGrid />
      <Trustability />

      <BrandsSection />
    </div>
  );
}
