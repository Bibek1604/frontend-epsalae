import { Truck, ShieldCheck, RefreshCw, Clock, BadgeCheck, Headphones } from 'lucide-react';

export default function Trustability() {
  const features = [
    { 
      icon: Truck, 
      title: "Fast and Free Delivery", 
      desc: "Free delivery on all orders"
    },
    { 
      icon: BadgeCheck, 
      title: "100% Verified Products", 
      desc: "All products are verified"
    },
    { 
      icon: ShieldCheck, 
      title: "Secure Payments", 
      desc: "100% secure payments"
    },
    { 
      icon: RefreshCw, 
      title: "Easy Returns", 
      desc: "7 days return policy"
    },
    { 
      icon: Headphones, 
      title: "24/7 Support", 
      desc: "Dedicated support"
    },
    { 
      icon: Clock, 
      title: "Quick Dispatch", 
      desc: "Order within 24 hours"
    },
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 text-center md:text-left"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {feature.title}
                </h4>
                <p className="text-gray-500 text-xs">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}