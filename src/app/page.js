import Link from "next/link";
import { GithubIcon } from "@/components/icons/SocialMediaIcons";

export default function Page() {
  return (
    <div className="text-center mt-20">
      <h1>Bonjour,</h1>
      <div className="mb-12">
        <p className="lead">
          My name is <strong>François Côté</strong>,
          <br />
          and I am a <strong>Web Developer</strong> based in{" "}
          <strong>Montréal (QC), Canada</strong>.
        </p>
      </div>
      <div className="flex justify-center">
        <a
          href="https://www.github.com/francoiscote"
          className="text-slate-400 hover:text-slate-500 mx-4"
        >
          <GithubIcon className="h-7 w-7 transition-colors" />
        </a>
        <Link href="/beers" className="text-3xl hover:no-underline mx-4 -mt-1">
          🍻
        </Link>
      </div>
    </div>
  );
}
