import TextButton from "./TextButton";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[80vh] px-4 gap-8">
      {/* Header & description  */}
      <h2 className="font-bold text-6xl text-center">
        What’s our next design task?
      </h2>
      <p className="text-center text-xl text-muted-foreground">
        Generate, iterate, and refine designs with the power of AI.
      </p>
      <TextButton />
    </section>
  );
};

export default Hero;
