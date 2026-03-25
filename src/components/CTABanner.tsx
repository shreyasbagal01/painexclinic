const CTABanner = () => (
  <section className="bg-primary py-10 md:py-14">
    <div className="container px-4 md:px-8 text-center">
      <h2 className="text-xl font-bold text-primary-foreground md:text-3xl">
        You've Read Enough. Let's Fix This.
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm md:text-base text-primary-foreground/80">
        Every week we meet patients who say "I wish I'd come sooner." If pain is stealing your sleep, your work, or your joy — it's time.
      </p>
      <div className="mt-5 md:mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
        <a
          href="https://www.painex.org/book-an-appointment/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto rounded-xl bg-card px-6 py-3.5 text-sm font-semibold text-primary shadow-card transition-colors hover:bg-card/90 active:bg-card/80 text-center"
        >
          Book at Painex Clinic
        </a>
        <a
          href="https://www.headacheandmigraineclinic.com/book-an-appointment/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto rounded-xl border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 active:bg-primary-foreground/15 text-center"
        >
          Migraine? Start Here
        </a>
      </div>
    </div>
  </section>
);

export default CTABanner;