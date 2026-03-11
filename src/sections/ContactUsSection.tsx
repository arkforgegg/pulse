import { useState } from "react";
import { serviceOptions, channelOptions } from "../data/contactForm";
import type { ServiceOption, ChannelOption } from "../data/contactForm";

interface FormData {
  name: string;
  contactNumber: string;
  company: string;
  email: string;
  budget: string;
  location: string;
  services: ServiceOption[];
  channels: ChannelOption[];
  message: string;
}

const initialFormData: FormData = {
  name: "",
  contactNumber: "",
  company: "",
  email: "",
  budget: "",
  location: "",
  services: [],
  channels: [],
  message: "",
};

function TextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-display text-base font-bold text-white md:text-lg">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-[#adadad] bg-transparent px-5 py-2.5 font-sans text-base text-white placeholder-[#adadad] outline-none transition-colors focus:border-accent md:text-lg"
      />
    </div>
  );
}

function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
}) {
  const toggle = (option: T) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="font-display text-base font-bold text-white md:text-lg">
        {label}
      </span>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="sr-only"
            />
            <div className="relative flex size-6 shrink-0 items-center justify-center border-[0.5px] border-white">
              {selected.includes(option) && (
                <svg
                  className="size-4 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="font-sans text-base text-[#adadad] md:text-lg">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ContactUsSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      `Name: ${formData.name}`,
      `Contact Number: ${formData.contactNumber}`,
      `Company: ${formData.company}`,
      `Email: ${formData.email}`,
      `Budget: ${formData.budget}`,
      `Location: ${formData.location}`,
      `Services: ${formData.services.join(", ") || "None"}`,
      `Channels: ${formData.channels.join(", ") || "None"}`,
      "",
      `Message:`,
      formData.message,
    ];

    const subject = encodeURIComponent(
      `New Inquiry from ${formData.name || "Website Visitor"}`
    );
    const body = encodeURIComponent(lines.join("\n"));

    window.open(`mailto:BUSINESS@PULSENOVA.GG?subject=${subject}&body=${body}`);
  };

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[2000px] -translate-x-1/2 -translate-y-1/2 lg:h-[1000px] lg:w-[2400px]">
        <div
          className="h-full w-full blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(54, 244, 219, 0.8) 0%, rgba(54, 244, 219, 0.5) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <h2 id="contact" className="mx-auto max-w-5xl bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text text-center font-display text-xl font-bold leading-normal tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-[56px]">
          Ready To Take Your Marketing
          <br />
          To The Next Level?
        </h2>

        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-10 max-w-[1206px] overflow-hidden rounded-xl border border-[#e6fffe] bg-[#101010] p-6 md:mt-16 md:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute top-0 left-1/2 h-[354px] w-[439px] -translate-x-1/2 -translate-y-1/2">
            <div
              className="h-full w-full blur-[80px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(172, 66, 251, 0.8) 0%, transparent 70%)",
              }}
            />
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:gap-16 lg:gap-20">
            <div className="flex flex-1 flex-col gap-7">
              <TextInput
                label="Name"
                value={formData.name}
                placeholder="Eg. Jonathan Wong"
                onChange={(v) => updateField("name", v)}
              />
              <TextInput
                label="Company"
                value={formData.company}
                placeholder="Eg. Pulse Nova"
                onChange={(v) => updateField("company", v)}
              />
              <TextInput
                label="Budget"
                value={formData.budget}
                placeholder="USD10,000 - USD50,000"
                onChange={(v) => updateField("budget", v)}
              />
              <CheckboxGroup
                label="Services"
                options={serviceOptions}
                selected={formData.services}
                onChange={(v) => updateField("services", v)}
              />
            </div>

            <div className="flex flex-1 flex-col gap-7">
              <TextInput
                label="Contact Number"
                value={formData.contactNumber}
                placeholder="Eg. 091-999 9999"
                onChange={(v) => updateField("contactNumber", v)}
              />
              <TextInput
                label="Email"
                value={formData.email}
                placeholder="Eg. hello@pulsenova.com"
                onChange={(v) => updateField("email", v)}
              />
              <TextInput
                label="Location"
                value={formData.location}
                placeholder="Eg. USA"
                onChange={(v) => updateField("location", v)}
              />
              <CheckboxGroup
                label="Channel"
                options={channelOptions}
                selected={formData.channels}
                onChange={(v) => updateField("channels", v)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <label className="font-display text-base font-bold text-white md:text-lg">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Write your message here"
              rows={6}
              className="resize-none border border-[#adadad] bg-transparent px-5 py-2.5 font-sans text-base text-white placeholder-[#adadad] outline-none transition-colors focus:border-accent md:text-lg"
            />
          </div>

          <button
            type="submit"
            className="mt-8 cursor-pointer rounded-[4px] border border-[#8288d4] bg-linear-to-l from-[#6ce5de] from-2% via-[#6ea2cc] via-64% to-[#9370db] px-6 py-3 font-sans text-base font-bold text-white transition-opacity hover:opacity-90 md:px-8 md:py-3.5 md:text-lg"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </section>
  );
}
