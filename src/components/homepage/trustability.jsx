import { Truck, ShieldCheck, RefreshCw, Clock, BadgeCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Trustability() {
  const features = [
    { 
      icon: Truck, 
      title: "Free & Fast Delivery", 
      desc: "Free delivery on orders above Rs.5000",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50"
    },
    { 
      icon: BadgeCheck, 
      title: "100% Genuine Products", 
      desc: "Verified authentic products only",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50"
    },
    { 
      icon: ShieldCheck, 
      title: "Secure Payments", 
      desc: "SSL encrypted checkout",
      color: "from-purple-500 to-violet-600",
      bg: "bg-purple-50"
    },
    { 
      icon: RefreshCw, 
      title: "Easy Returns", 
      desc: "7 days hassle-free returns",
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50"
    },
    { 
      icon: Headphones, 
      title: "24/7 Support", 
      desc: "Always here to help you",
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-50"
    },
    { 
      icon: Clock, 
      title: "Quick Dispatch", 
      desc: "Ships within 24 hours",
      color: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-50"
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-4 text-center transition-all duration-300 rounded-2xl hover:bg-gray-50 group"
            >
              <div className={`flex items-center justify-center w-14 h-14 ${feature.bg} rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: feature.color.includes('emerald') ? '#10b981' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('purple') ? '#8b5cf6' : feature.color.includes('orange') ? '#f97316' : feature.color.includes('pink') ? '#ec4899' : '#06b6d4' }} />
              </div>
              <h4 className="mb-1 text-sm font-bold text-gray-900">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-500">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 