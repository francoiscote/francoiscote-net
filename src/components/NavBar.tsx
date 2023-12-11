import Link from "next/link";
import { NewMoonFace } from "./icons/Twemoji";

export function NavBar() {
  const linkVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 0.9,
    },
    pressed: {
      scale: 1.1,
    },
  };

  return (
    <div className="mb-16">
      <nav className="flex justify-between py-4">
        <Link href="/" passHref>
          <NewMoonFace />
        </Link>
        {/* <div>TODO: Dark mode toggle</div> */}
      </nav>
    </div>
  );
}
