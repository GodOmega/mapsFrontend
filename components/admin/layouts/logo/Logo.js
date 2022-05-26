import LogoDark from "../images/amplelogo.svg";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/admin/users">
      <a>
        <Image src={LogoDark} alt="logo" />
      </a>
    </Link>
  );
};

export default Logo;
