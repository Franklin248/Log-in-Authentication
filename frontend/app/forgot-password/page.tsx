
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#241a14] px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-[#8c674b]/30 bg-[#35271e]/90 px-8 py-12 text-center shadow-2xl sm:px-12">

        {/* Work in Progress Image */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/WorkOnProgress.png"
            alt="Work in Progress"
            width={500}
            height={350}
            priority
            className="h-auto w-full max-w-[320px] object-contain"
          />
        </div>

        {/* Heading */}
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d5a779]">
          UNDER CONSTRUCTION
        </span>

        <h1 className="mt-4 text-3xl font-bold text-[#f5e6d3] sm:text-4xl">
          Hold Your Capybaras!
        </h1>

        {/* Message */}
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#cbb8a5]">
          Looks like this little corner is still taking a capy-nap!
          Our capybara crew is working hard behind the scenes to
          bring you the password recovery feature.
        </p>

        <p className="mt-4 text-sm text-[#d5a779]">
          Don't worry, it'll be ready before you can say
          <span className="font-semibold"> "Hap-pybara!" </span>
          🧡
        </p>

        {/* Return Button */}
        <Link
          href="/"
          className="mt-9 inline-flex items-center justify-center rounded-xl bg-[#c58a61] px-8 py-3 font-semibold text-[#241a14] transition duration-300 hover:-translate-y-1 hover:bg-[#d9a47d] hover:shadow-lg"
        >
          Back to Login
        </Link>

        {/* Footer */}
        <p className="mt-10 text-xs tracking-wide text-[#8f7966]">
          Capybara Login Authenticator · Take it easy, take it capy.
        </p>
      </div>
    </main>
  );
}
