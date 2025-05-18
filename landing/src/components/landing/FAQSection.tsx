import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Accord AI?",
    answer: "Accord AI is an intelligent contract platform that uses advanced AI to help legal professionals and businesses draft, review, and negotiate contracts more efficiently. Our platform combines custom language models, fine-tuning, and retrieval-augmented generation to provide superior accuracy and context-awareness for legal documents."
  },
  {
    question: "How does Accord AI improve the contract drafting process?",
    answer: "Accord AI streamlines contract creation with intelligent templates, clause suggestions, and real-time feedback. It automatically identifies risks, suggests improvements, and helps maintain consistency across documents. The platform learns from your revisions and preferences over time, becoming more tailored to your specific needs and style."
  },
  {
    question: "Is Accord AI secure for handling sensitive legal documents?",
    answer: "Yes, security is our top priority. Accord AI employs enterprise-grade encryption, strict access controls, and secure cloud infrastructure. We're compliant with industry standards for data protection and privacy. Your documents remain your intellectual property, and we maintain strict data segregation between clients."
  },
  {
    question: "Can Accord AI integrate with our existing tools and workflows?",
    answer: "Absolutely. Accord AI is designed to integrate seamlessly with popular document management systems, CRM platforms, and collaboration tools. We offer REST APIs and webhook capabilities for custom integrations with your internal systems, and our team can provide support for specialized implementation needs."
  },
  {
    question: "How accurate is Accord AI's contract analysis?",
    answer: "Our AI models are specifically trained on legal documents and continuously refined through expert feedback. This specialized training allows Accord AI to achieve significantly higher accuracy than general-purpose AI tools. Our system identifies contract issues, risks, and inconsistencies with precision comparable to experienced legal professionals."
  },
  {
    question: "What types of contracts can Accord AI handle?",
    answer: "Accord AI supports a wide range of contract types including NDAs, service agreements, employment contracts, licensing agreements, sales contracts, and more. Our platform is adaptable to virtually any contract type and can be trained on your organization's specific document formats and requirements."
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 px-4 md:px-8 bg-subtle-accent relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about Accord AI's contract intelligence platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="space-y-4">
            {faqs.slice(0, 3).map((faq, index) => (
              <AccordionFAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
          <div className="space-y-4">
            {faqs.slice(3).map((faq, index) => (
              <AccordionFAQItem key={index + 3} faq={faq} index={index + 3} />
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Have a question that's not answered here?
          </p>
          <a
            href="mailto:support@accordify.ai"
            className="text-primary hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}

function AccordionFAQItem({ 
  faq, 
  index 
}: { 
  faq: { question: string; answer: string }; 
  index: number;
}) {
  return (
    <div className={cn(
      "rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all",
      "hover:border-primary/20 hover:shadow-sm"
    )}>
      <Accordion type="single" collapsible>
        <AccordionItem value={`item-${index}`} className="border-none">
          <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
