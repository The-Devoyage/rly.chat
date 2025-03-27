import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, Logo } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
      <div className="inline-block max-w-xl text-center justify-center items-center">
        <span className={title()}>Message&nbsp;</span>
        <span className={title({ color: "orange" })}>Freely.</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
          Open Source and End to End Encrypted Chat.
        </div>
      </div>
      <Logo size={200} />
      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "sm",
            variant: "shadow",
          })}
          href="/sims"
        >
          SIMs
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "sm" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>
    </section>
  );
}
