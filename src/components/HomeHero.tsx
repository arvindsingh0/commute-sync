import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="home-hero">
      <Image
        src="/HeroImageHQ.jpg"
        alt="CommuteSync Hero"
        width={3840}
        height={1461}
        className="home-hero-image"
        priority
      />
    </section>
  );
}
