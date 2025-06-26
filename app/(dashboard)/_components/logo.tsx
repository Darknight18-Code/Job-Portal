import Image from "next/image"
const Logo = () => {
  return (
    <Image
        height={150}
        width={150}
        alt="logo"
        src="/img/logo.png"
    />
  )
}

export default Logo
