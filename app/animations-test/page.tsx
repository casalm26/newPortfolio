import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";
import { PixelLoader } from "@/components/shared/PixelLoader";

export default function AnimationsTestPage() {
  return (
    <PageTransition className="w-full">
      <div className="min-h-screen bg-black text-white p-8 space-y-16">
        {/* Header */}
        <header className="text-center">
          <ScrollAnimated animation="fade-in">
            <h1 className="text-4xl font-pixel mb-4">
              <TypewriterText
                text={["Animation Test", "Pixel Art Effects", "Interactive Elements"]}
                speed={100}
                loop={true}
              />
            </h1>
          </ScrollAnimated>
          <ScrollAnimated animation="scale-in" delay={500}>
            <p className="text-gray-400 font-pixel">
              Testing all pixel art animations and effects
            </p>
          </ScrollAnimated>
        </header>

        {/* Button Tests */}
        <section className="space-y-8">
          <ScrollAnimated animation="slide-in-left">
            <h2 className="text-2xl font-pixel mb-4">Button Effects</h2>
          </ScrollAnimated>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimated animation="fade-in" delay={200}>
              <div className="space-y-4">
                <h3 className="font-pixel text-lg">Basic Pixel Buttons</h3>
                <button className="btn-pixel px-4 py-2">Basic</button>
                <button className="btn-pixel-glow px-4 py-2">Glowing</button>
                <button className="btn-pixel-bounce px-4 py-2">Bouncy</button>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={400}>
              <div className="space-y-4">
                <h3 className="font-pixel text-lg">3D Effects</h3>
                <button className="btn-pixel-3d px-4 py-2">3D Button</button>
                <button className="btn-pixel-iso px-4 py-2">Isometric</button>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={600}>
              <div className="space-y-4">
                <h3 className="font-pixel text-lg">Interactive Cards</h3>
                <div className="card-pixel p-4">Basic Card</div>
                <div className="card-pixel-glow p-4">Glowing Card</div>
                <div className="card-pixel-interactive p-4">Interactive Card</div>
              </div>
            </ScrollAnimated>
          </div>
        </section>

        {/* Animation Tests */}
        <section className="space-y-8">
          <ScrollAnimated animation="slide-in-right">
            <h2 className="text-2xl font-pixel mb-4">Scroll Animations</h2>
          </ScrollAnimated>

          <div className="space-y-8">
            <ScrollAnimated animation="slide-in-left">
              <div className="card-pixel p-6">
                <h3 className="font-pixel text-lg mb-2">Slide from Left</h3>
                <p className="text-gray-400">This content slides in from the left when scrolled into view.</p>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="slide-in-right">
              <div className="card-pixel p-6">
                <h3 className="font-pixel text-lg mb-2">Slide from Right</h3>
                <p className="text-gray-400">This content slides in from the right when scrolled into view.</p>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="scale-in">
              <div className="card-pixel p-6">
                <h3 className="font-pixel text-lg mb-2">Scale In</h3>
                <p className="text-gray-400">This content scales in when scrolled into view.</p>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="pixel-bounce">
              <div className="card-pixel p-6">
                <h3 className="font-pixel text-lg mb-2">Pixel Bounce</h3>
                <p className="text-gray-400">This content bounces in with pixel-perfect animation.</p>
              </div>
            </ScrollAnimated>
          </div>
        </section>

        {/* Typewriter Tests */}
        <section className="space-y-8">
          <ScrollAnimated animation="fade-in">
            <h2 className="text-2xl font-pixel mb-4">Typewriter Effects</h2>
          </ScrollAnimated>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollAnimated animation="fade-in" delay={200}>
              <div className="card-pixel p-6 space-y-4">
                <h3 className="font-pixel text-lg">Single Text</h3>
                <TypewriterText text="This text appears character by character..." speed={50} />
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={400}>
              <div className="card-pixel p-6 space-y-4">
                <h3 className="font-pixel text-lg">Multiple Texts</h3>
                <TypewriterText
                  text={["Hello World!", "Welcome to the matrix.", "Pixel art is cool!", "Let's build something awesome."]}
                  speed={80}
                  loop={true}
                />
              </div>
            </ScrollAnimated>
          </div>
        </section>

        {/* Loader Tests */}
        <section className="space-y-8">
          <ScrollAnimated animation="fade-in">
            <h2 className="text-2xl font-pixel mb-4">Loading Animations</h2>
          </ScrollAnimated>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ScrollAnimated animation="fade-in" delay={100}>
              <div className="card-pixel p-6 text-center">
                <h3 className="font-pixel text-sm mb-4">Dots</h3>
                <PixelLoader type="dots" size="md" />
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={200}>
              <div className="card-pixel p-6 text-center">
                <h3 className="font-pixel text-sm mb-4">Bars</h3>
                <PixelLoader type="bars" size="md" />
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={300}>
              <div className="card-pixel p-6 text-center">
                <h3 className="font-pixel text-sm mb-4">Spinner</h3>
                <PixelLoader type="spinner" size="md" />
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={400}>
              <div className="card-pixel p-6 text-center">
                <h3 className="font-pixel text-sm mb-4">Typewriter</h3>
                <PixelLoader type="typewriter" text="Loading data..." />
              </div>
            </ScrollAnimated>
          </div>
        </section>

        {/* CSS Animation Tests */}
        <section className="space-y-8">
          <ScrollAnimated animation="fade-in">
            <h2 className="text-2xl font-pixel mb-4">CSS Animations</h2>
          </ScrollAnimated>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimated animation="fade-in" delay={200}>
              <div className="card-pixel p-6 text-center space-y-4">
                <h3 className="font-pixel text-lg">Pixel Glow</h3>
                <div className="w-16 h-16 mx-auto bg-white animate-pixel-glow"></div>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={400}>
              <div className="card-pixel p-6 text-center space-y-4">
                <h3 className="font-pixel text-lg">Loading Animation</h3>
                <div className="w-16 h-16 mx-auto bg-white animate-pixel-loading"></div>
              </div>
            </ScrollAnimated>

            <ScrollAnimated animation="fade-in" delay={600}>
              <div className="card-pixel p-6 text-center space-y-4">
                <h3 className="font-pixel text-lg">Bounce on Hover</h3>
                <div className="w-16 h-16 mx-auto bg-white hover:animate-pixel-bounce cursor-pointer"></div>
              </div>
            </ScrollAnimated>
          </div>
        </section>

        {/* Performance Note */}
        <ScrollAnimated animation="fade-in">
          <footer className="text-center">
            <div className="card-pixel p-6 bg-gray-900">
              <p className="font-pixel text-sm text-gray-400">
                All animations respect user preferences for reduced motion and can be disabled.
              </p>
            </div>
          </footer>
        </ScrollAnimated>
      </div>
    </PageTransition>
  );
}