'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const faqs = [
  {
    question: "আমি আমার কেনা ই-বুক বা কোর্স কীভাবে অ্যাক্সেস করবো?",
    answer: "পেমেন্ট ভেরিফিকেশন সম্পন্ন হলে আপনার কেনা ই-বুক ও কোর্স আপনার \"My Library\"-তে যোগ হয়ে যাবে। লগইন করে সেখান থেকেই পড়তে বা দেখতে পারবেন।",
  },
  {
    question: "আমি কি ই-বুক বা কোর্স ডাউনলোড করতে পারবো?",
    answer: "না। কন্টেন্ট সুরক্ষার জন্য ই-বুক ও কোর্স শুধুমাত্র আমাদের সিকিউর রিডার ও ভিডিও প্লেয়ারের মাধ্যমে দেখা যাবে। ডাউনলোড করার কোনো অপশন নেই।",
  },
  {
    question: "এক অ্যাকাউন্টে কয়টা ডিভাইস ব্যবহার করা যাবে?",
    answer: "প্রতি অ্যাকাউন্টে সর্বোচ্চ ২টি ডিভাইস ব্যবহার করা যাবে। এর বেশি হলে অ্যাক্সেস বন্ধ থাকবে।",
  },
  {
    question: "আপনারা কোন পেমেন্ট মেথড নেন?",
    answer: "বর্তমানে আমরা শুধুমাত্র bKash Send Money গ্রহণ করি। পেমেন্টের সময় নির্দিষ্ট নির্দেশনা অনুসরণ করা বাধ্যতামূলক।",
  },
  {
    question: "আপনারা কি রিফান্ড (Refund) দেন?",
    answer: "না। একবার পেমেন্ট সম্পন্ন হলে কোনো ধরনের রিফান্ড দেওয়া হয় না। কেনার আগে অনুগ্রহ করে বিস্তারিত পড়ে নিন।",
  },
];

const WHATSAPP_NUMBER = "8801925545557";

function FAQItem({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: typeof faqs[0]; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden transition-shadow duration-300 hover:shadow-md cursor-pointer"
        onClick={onToggle}
        data-testid={`faq-item-${index}`}
      >
        <CardContent className="p-0">
          <button
            className="w-full flex items-center justify-between gap-4 p-6 text-left"
            aria-expanded={isOpen}
            data-testid={`button-faq-toggle-${index}`}
          >
            <h3 className="font-semibold text-base md:text-lg leading-relaxed">
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </button>
          
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6">
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {faq.answer}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("হ্যালো, আমি TheSedder থেকে সাহায্য চাই।");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">সাধারণ জিজ্ঞাসা</h2>
          <p className="text-muted-foreground">
            আপনার প্রশ্নের উত্তর এখানে পাবেন
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            আপনার প্রশ্নের উত্তর খুঁজে পাননি?
          </p>
          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            data-testid="button-whatsapp-support"
          >
            <SiWhatsapp className="h-5 w-5" />
            WhatsApp এ সাপোর্ট নিন
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
