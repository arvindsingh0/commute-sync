import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="home-hero">
      <Image
        src="/HeroImageHD.jpg"
        alt="CommuteSync Hero"
        width={2560}
        height={974}
        className="home-hero-image"
        priority
      />
    </section>
  );
}
