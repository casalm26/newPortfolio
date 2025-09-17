import Header from "@/components/shared/Header";
import { PixelArtName } from "@/components/landing";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />

      {/* Hero Section - Pixel Art Name */}
      <section className="min-h-screen flex items-center justify-center bg-black px-4 pt-20">
        <PixelArtName className="w-full" />
      </section>
    </div>
  );
}
