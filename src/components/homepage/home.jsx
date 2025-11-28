import Category from "./category";
import Trustability from "./trustability";
import Banner from "./banner";
import BrandsSection from "./brand";
import ProductsGrid from "./product";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <BrandsSection />
      <Category />
      <ProductsGrid />
      <Trustability />
    </div>
  );
}

