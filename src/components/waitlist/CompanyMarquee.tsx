const COMPANIES = [
  "Google", "Apple", "Microsoft", "Amazon", "Meta",
  "Netflix", "Salesforce", "Adobe", "Oracle", "IBM",
  "McKinsey", "Deloitte", "Goldman Sachs", "JPMorgan", "Accenture",
  "Stripe", "Uber", "Airbnb", "Tesla", "NVIDIA",
  "Spotify", "LinkedIn", "Twitter", "Snap", "Shopify",
  "Bain & Co", "BCG", "Morgan Stanley", "Cisco", "Intel",
];

interface CompanyMarqueeProps {
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export const CompanyMarquee = ({
  direction = "left",
  speed = 40,
  className = "",
}: CompanyMarqueeProps) => {
  return (
    <div className={`relative w-full overflow-hidden py-4 ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div
        className={direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          gap: "3rem",
          ["--marquee-duration" as string]: `${speed}s`,
        }}
      >
        {/* Duplicate list for seamless loop */}
        {[...COMPANIES, ...COMPANIES].map((company, i) => (
          <span
            key={`${company}-${i}`}
            className="text-muted-foreground/20 text-lg md:text-xl font-semibold tracking-wider uppercase select-none flex-shrink-0"
          >
            {company}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CompanyMarquee;
