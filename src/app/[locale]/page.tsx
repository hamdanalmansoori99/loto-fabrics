import EditorialHero from "@/components/home/editorial-hero";
import TrustMarquee from "@/components/home/trust-marquee";
import LookbookStrip from "@/components/home/lookbook-strip";
import FeaturedGrid from "@/components/home/featured-grid";
import CollectionTiles from "@/components/home/collection-tiles";
import DesignStudioTeaser from "@/components/home/design-studio-teaser";
import JournalTeaser from "@/components/home/journal-teaser";
import InstagramGrid from "@/components/home/instagram-grid";
import NewsletterBand from "@/components/home/newsletter-band";

export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <TrustMarquee />
      <LookbookStrip />
      <FeaturedGrid />
      <CollectionTiles />
      <DesignStudioTeaser />
      <JournalTeaser />
      <InstagramGrid />
      <NewsletterBand />
    </>
  );
}
