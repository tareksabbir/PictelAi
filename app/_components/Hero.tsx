
import TextButton from "./TextButton";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-start min-h-screen py-12 px-4 gap-6 md:gap-8 overflow-x-hidden">
      {/* Header & description with better spacing */}
      <div className="flex flex-col items-center gap-4 max-w-4xl w-full pt-8 md:pt-44">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center leading-tight">
          What's our next design task?
        </h1>
        <p className="text-center text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
          Generate, iterate, and refine designs with the power of AI.
        </p>
      </div>
      
      {/* TextButton component with proper container */}
      <div className="w-full flex justify-center">
        <TextButton />
      </div>
    </section>
  );
};

export default Hero;