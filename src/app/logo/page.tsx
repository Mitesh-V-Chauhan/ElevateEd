import Image from 'next/image';

const LogoPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Image
        src="/elevateed.jpeg"
        alt="ElevateEd Logo"
        width={500}
        height={500}
        className="rounded-lg"
      />
    </div>
  );
};

export default LogoPage;
