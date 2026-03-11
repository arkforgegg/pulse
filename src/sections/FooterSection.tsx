import { useState } from "react";
import { LegalModal } from "../components/LegalModal";
import {
  privacyPolicyContent,
  termsOfUseContent,
} from "../data/legalContent";
import { footerEmail, footerLinks, socialLinks } from "../data/footer";
import type { LegalModalId } from "../data/footer";

export function FooterSection() {
  const [openModal, setOpenModal] = useState<LegalModalId | null>(null);

  const modalContent =
    openModal === "privacy"
      ? { title: "Privacy Policy", blocks: privacyPolicyContent }
      : openModal === "terms"
        ? { title: "Terms of Use", blocks: termsOfUseContent }
        : null;

  return (
    <footer className="relative overflow-hidden bg-black px-4 py-8 md:pt-20 md:pb-10">
      <div className="relative z-10 mx-auto max-w-7xl">
        <h2 className="flex flex-col items-center justify-center gap-1 text-center font-display text-xl font-bold leading-normal md:flex-row md:gap-5 md:text-4xl lg:text-[48px]">
          <span className="text-white">CONTACT US AT</span>
          <a
            href={`mailto:${footerEmail}`}
            className="bg-linear-to-r from-[#9370db] via-[#709ecd] via-54% to-[#6ce5de] bg-clip-text text-transparent transition-opacity hover:opacity-80"
          >
            {footerEmail}
          </a>
        </h2>

        <div className="mt-8 flex justify-center md:mt-14">
          <img
            src="/images/logo-footer.png"
            alt="Pulse Nova Entertainment"
            className="h-24 w-auto md:h-36 lg:h-40"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-7 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
            >
              <img src={icon} alt={label} className="size-full" />
            </a>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between text-[13px] text-white md:hidden">
          {footerLinks.map(({ label, modalId }) => (
            <button
              key={label}
              type="button"
              onClick={() => setOpenModal(modalId)}
              className="transition-colors hover:text-accent"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1 text-xs text-white md:hidden">
          <span>©</span>
          <span>2026 Pulse Nova</span>
        </p>

        {modalContent && (
          <LegalModal
            title={modalContent.title}
            blocks={modalContent.blocks}
            isOpen={!!openModal}
            onClose={() => setOpenModal(null)}
          />
        )}
        <div className="mt-20 hidden items-center justify-between md:flex">

          <div className="flex gap-9 text-lg text-white">
            {footerLinks.map(({ label, modalId }) => (
              <button
                key={label}
                type="button"
                onClick={() => setOpenModal(modalId)}
                className="transition-colors hover:text-accent"
              >
                {label}
              </button>
            ))}
          </div>

          <p className="flex items-center gap-1.5 text-lg text-white">
            <span>©</span>
            <span>2026 Copyright Pulse Nova, all rights reserved.</span>
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-7 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
              >
                <img src={icon} alt={label} className=" size-7" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[100px] w-[500px] -translate-x-1/2 translate-y-1/4 md:h-[200px] md:w-[2000px] md:translate-y-1/3 lg:h-[250px] lg:w-[2400px]">
        <div
          className="h-full w-full blur-[60px] md:blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(54, 244, 219, 0.6) 0%, rgba(54, 244, 219, 0.9) 40%, transparent 70%)",
          }}
        />
      </div>
    </footer>
  );
}
