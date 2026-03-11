import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { LegalBlock } from "../data/legalContent";

type LegalModalProps = {
  title: string;
  blocks: LegalBlock[];
  isOpen: boolean;
  onClose: () => void;
};

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h1":
      return (
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
          {block.text}
        </h1>
      );
    case "h2":
      return (
        <h2 className="mt-6 font-display text-lg font-bold text-white md:mt-8 md:text-xl">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-4 font-display text-base font-semibold text-white/95 md:mt-5">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-2 text-sm leading-relaxed text-white/90 md:text-base">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/90 md:text-base">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export function LegalModal({ title, blocks, isOpen, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-label="Close"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-white/10 bg-black shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 md:px-6 md:py-4">
          <h2
            id="legal-modal-title"
            className="font-display text-lg font-bold text-white md:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          <div className="space-y-1">
            {blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
