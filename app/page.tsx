import { WaitlistForm } from "@/components/waitlist-form";

const areas = [
  {
    title: "Understand yourself",
    body: "How you make decisions, how you show what you feel, what quietly drains you, how you behave under pressure, and where your contradictions actually come from.",
    sample: "You appear adaptable, but your sense of security depends on knowing what comes next.",
  },
  {
    title: "Understand your timing",
    body: "The season you’re in right now, whether conditions favor starting something or consolidating what already exists, and which themes are live.",
    sample: "You’re at the end of a long building stretch. Finishing has more leverage right now than starting.",
  },
  {
    title: "Understand your relationships",
    body: "Compare your chart with a partner, a friend, a parent, a colleague. Not a compatibility score — where the two of you genuinely understand each other, where you run at different speeds, and what each of you needs in the middle of a conflict.",
    sample: "You think out loud; they need to go quiet first. Same intention, different recovery speed.",
  },
];

const ritual = [
  {
    label: "One observation",
    text: "You’re in a stretch where structure gives you more room, not less.",
  },
  {
    label: "One live theme",
    text: "Consolidating. Conditions favor closing loops rather than opening new ones.",
  },
  {
    label: "One useful action",
    text: "Pick the open loop that keeps following you into the evening and finish it, imperfectly.",
  },
  {
    label: "One question",
    text: "Where are you waiting for certainty about a decision you’ve already made?",
  },
];

/**
 * The four-part measure. Four is the structure the product is named for, so it
 * is the page's recurring measure rather than an applied ornament: four cells,
 * one filled per section, all four filled on the ritual card.
 */
function Measure({
  step,
  label,
  inverse = false,
  tone = "primary",
}: {
  step: number;
  label: string;
  inverse?: boolean;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="flex items-center gap-4">
      <div aria-hidden className="flex w-[104px] shrink-0 gap-[5px] sm:w-[132px] sm:gap-1.5">
        {[1, 2, 3, 4].map((cell) => (
          <span
            key={cell}
            className={`h-[3px] flex-1 ${
              cell <= step
                ? inverse
                  ? "bg-inverse-foreground"
                  : tone === "accent"
                    ? "bg-[var(--brand-secondary)]"
                    : "bg-primary"
                : inverse
                  ? "bg-[var(--border-inverse)]"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-[11px] uppercase tracking-[0.2em] ${
          inverse ? "opacity-60" : "text-tertiary-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main aria-label="MING" className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-5 pt-7 sm:px-8">
        <span className="font-display text-[20px] uppercase tracking-[0.24em]">Ming</span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-tertiary-foreground">
          Four Pillars, plainly
        </span>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-10 pb-14 sm:px-8 sm:pt-20 sm:pb-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-secondary)]">
          The part Western astrology never gave you
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-[38px] leading-[1.06] tracking-[-0.02em] text-balance sm:text-[62px]">
          Your Four Pillars chart, in language you’d actually use.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-[1.62] text-muted-foreground sm:mt-6 sm:text-[19px]">
          Your birth date, time and place build a BaZi chart — Four Pillars — an old Chinese way of
          reading the conditions you’re working with. MING writes it out in plain English: no jargon
          on the first screen, no horoscope voice.
        </p>
        <div className="mt-8 max-w-lg sm:mt-9">
          <WaitlistForm source="landing_hero" />
        </div>
      </section>

      <section className="bg-inverse text-inverse-foreground">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <Measure step={1} label="Conditions, not predictions" inverse />
          <p className="font-display mt-8 max-w-2xl text-[26px] leading-[1.2] sm:text-[38px]">
            MING never tells you what is going to happen.
          </p>
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] opacity-75 sm:text-[17px]">
            It describes the conditions around you — what is supported right now, what will cost you
            more effort than usual, and where your own patterns are quietly doing the deciding. Then
            it leaves the choosing to you. That is the whole difference between a reading and a
            fortune.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Measure step={2} label="What MING reads" />
        <ol className="mt-12">
          {areas.map((area, index) => (
            <li
              key={area.title}
              className="border-t border-border pt-9 pb-9 first:border-t-0 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[4rem_1fr] sm:gap-6"
            >
              <span className="font-display block text-[15px] text-[var(--brand-secondary)] sm:pt-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mt-3 sm:mt-0">
                <h3 className="font-display text-[27px] leading-[1.15] sm:text-[34px]">
                  {area.title}
                </h3>
                <p className="mt-3.5 max-w-xl text-[16px] leading-[1.62] text-muted-foreground sm:text-[17px]">
                  {area.body}
                </p>
                <figure className="rule-clay mt-6 border-l-2 pl-4">
                  <figcaption className="text-[11px] uppercase tracking-[0.16em] text-tertiary-foreground">
                    It might say
                  </figcaption>
                  <p className="mt-2 max-w-xl text-[18px] leading-[1.5] sm:text-[19px]">
                    {area.sample}
                  </p>
                </figure>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <Measure step={3} label="The daily two minutes" />
          <div className="mt-12 md:grid md:grid-cols-[1fr_1.05fr] md:gap-16">
            <div className="md:pt-2">
              <h2 className="font-display text-[30px] leading-[1.12] sm:text-[40px]">
                Two minutes, every morning.
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-[1.62] text-muted-foreground sm:text-[17px]">
                Not a feed and not a daily fortune. Four short things written from your chart — one
                observation, one theme that’s live right now, one thing worth doing, one question to
                sit with. Then MING gets out of the way.
              </p>
            </div>

            <figure className="mt-10 rounded-lg border border-border bg-background p-6 sm:p-8 md:mt-0">
              <Measure step={4} label="An example day" tone="accent" />
              <dl className="mt-6">
                {ritual.map((item) => (
                  <div
                    key={item.label}
                    className="border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-[17px] leading-[1.5] sm:text-[18px]">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </figure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Measure step={4} label="The waitlist" />
        <h2 className="font-display mt-12 max-w-2xl text-[31px] leading-[1.1] text-balance sm:text-[46px]">
          MING is not open yet. Leave your email and we’ll write once, the day it opens.
        </h2>
        <p className="mt-5 max-w-xl text-[16px] leading-[1.62] text-muted-foreground sm:text-[17px]">
          If someone in your family mentioned BaZi and nobody ever explained it in a way that meant
          anything, MING is the explanation. The traditional terms sit underneath, for the day you
          want them.
        </p>
        <div className="mt-9 max-w-lg">
          <WaitlistForm source="landing_footer" />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-[13px] text-tertiary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-display text-[15px] uppercase tracking-[0.24em] text-foreground">
            Ming
          </span>
          <span>Conditions and choices, not predictions.</span>
        </div>
      </footer>
    </main>
  );
}
