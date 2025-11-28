import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export default function Trustability() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above Rs. 5000" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected transactions" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7 days return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "We're always here" },
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <div key={i} className="text-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300">
              <f.icon className="w-10 h-10 text-orange-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-800">{f.title}</h4>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}