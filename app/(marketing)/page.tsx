import HeroSection from "@/components/hero-section";
import Features from "@/components/features-5";
import IntegrationsSection from "@/components/integrations-5";
import ContentSection from "@/components/content-2";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/layout/footer";
import FAQsThree from "@/components/faqs-3";

export default function MarketingHome() {
  return (
    <main>
      <HeroSection />
      <Features />
      <IntegrationsSection />
      <ContentSection />
      <FAQsThree />
      <CallToAction />
      <Footer />
    </main>
  );
}

