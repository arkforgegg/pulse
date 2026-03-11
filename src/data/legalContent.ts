/** Block types for rendering legal content in the modal */
export type LegalBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export const privacyPolicyContent: LegalBlock[] = [
  { type: "h1", text: "Privacy Policy" },
  { type: "p", text: "Last updated: 05 March 2026" },
  { type: "h2", text: "1. Introduction" },
  {
    type: "p",
    text: 'Pulse Nova Entertainment ("Pulse Nova", "we", "us", or "our") respects your privacy and is committed to protecting your personal data.',
  },
  {
    type: "p",
    text: 'This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you visit our website www.pulsenova.gg (the "Website") or interact with our services.',
  },
  {
    type: "p",
    text: "By accessing or using the Website, you acknowledge that you have read and understood this Privacy Policy.",
  },
  { type: "h2", text: "2. Information We Collect" },
  {
    type: "p",
    text: "We may collect personal data when you interact with our Website, including:",
  },
  { type: "h3", text: "Information You Provide" },
  {
    type: "p",
    text: "When you submit information through forms or contact us, we may collect:",
  },
  {
    type: "ul",
    items: [
      "Name",
      "Email address",
      "Company or organisation name",
      "Social media handles or channel links",
      "Any information you voluntarily provide in messages or enquiries",
    ],
  },
  {
    type: "p",
    text: "This information is collected solely for the purpose of responding to your enquiry or evaluating potential partnerships, collaborations, or business opportunities.",
  },
  { type: "h3", text: "Automatically Collected Information" },
  {
    type: "p",
    text: "When you browse our Website, certain information may be automatically collected, such as:",
  },
  {
    type: "ul",
    items: [
      "IP address",
      "Browser type and device information",
      "Pages visited and time spent on the Website",
      "Referral links",
      "General geographic location (country/region level)",
    ],
  },
  {
    type: "p",
    text: "This information is collected through technologies such as cookies or analytics tools.",
  },
  { type: "h2", text: "3. How We Use Your Information" },
  { type: "p", text: "We may use the information we collect to:" },
  {
    type: "ul",
    items: [
      "Respond to enquiries and partnership requests",
      "Communicate with potential partners or clients",
      "Improve our Website and services",
      "Monitor website performance and usage analytics",
      "Maintain the security and integrity of our Website",
    ],
  },
  {
    type: "p",
    text: "We will only use personal data for purposes that are reasonable and necessary for our business operations.",
  },
  { type: "h2", text: "4. Cookies and Analytics" },
  {
    type: "p",
    text: "Our Website may use cookies or similar technologies to enhance user experience and analyse website traffic.",
  },
  { type: "p", text: "These technologies may help us:" },
  {
    type: "ul",
    items: [
      "Understand how visitors use our Website",
      "Improve website functionality",
      "Measure marketing effectiveness",
    ],
  },
  {
    type: "p",
    text: "You may choose to disable cookies through your browser settings, although some parts of the Website may not function properly.",
  },
  { type: "h2", text: "5. Disclosure of Personal Data" },
  { type: "p", text: "We do not sell your personal data." },
  {
    type: "p",
    text: "However, we may disclose personal data to trusted third parties where necessary, including:",
  },
  {
    type: "ul",
    items: [
      "Website hosting providers",
      "Analytics service providers",
      "Marketing or communications platforms",
      "Professional advisers or service providers",
    ],
  },
  {
    type: "p",
    text: "Such parties are required to handle personal data in accordance with applicable privacy laws.",
  },
  { type: "h2", text: "6. Data Retention" },
  {
    type: "p",
    text: "We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable laws.",
  },
  {
    type: "p",
    text: "When personal data is no longer required, we will take reasonable steps to securely delete or anonymise it.",
  },
  { type: "h2", text: "7. Protection of Personal Data" },
  {
    type: "p",
    text: "We implement reasonable administrative, technical, and organisational safeguards to protect personal data against unauthorised access, disclosure, alteration, or destruction.",
  },
  {
    type: "p",
    text: "While we strive to protect personal data, no method of transmission over the internet is completely secure.",
  },
  { type: "h2", text: "8. Third-Party Links" },
  {
    type: "p",
    text: "Our Website may contain links to third-party websites or platforms such as social media services.",
  },
  {
    type: "p",
    text: "We are not responsible for the privacy practices or content of these third-party websites. Users are encouraged to review the privacy policies of those platforms.",
  },
  { type: "h2", text: "9. Your Rights" },
  {
    type: "p",
    text: "Where applicable under data protection laws, you may have the right to:",
  },
  {
    type: "ul",
    items: [
      "Request access to personal data we hold about you",
      "Request correction of inaccurate personal data",
      "Withdraw consent to the use of your personal data (where applicable)",
    ],
  },
  { type: "p", text: "Requests may be submitted using the contact details below." },
  { type: "h2", text: "10. Changes to This Privacy Policy" },
  {
    type: "p",
    text: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
  },
  {
    type: "p",
    text: 'The updated version will be posted on this page with the revised "Last updated" date.',
  },
  { type: "h2", text: "11. Contact Us" },
  {
    type: "p",
    text: "If you have any questions regarding this Privacy Policy or our handling of personal data, please contact us at:",
  },
  { type: "p", text: "Pulse Nova Entertainment" },
  { type: "p", text: "Email: business@pulsenova.gg" },
  { type: "p", text: "Website: www.pulsenova.gg" },
];

export const termsOfUseContent: LegalBlock[] = [
  { type: "h1", text: "Terms of Use" },
  { type: "p", text: "Last updated: 05 March 2026" },
  { type: "h2", text: "1. Introduction" },
  { type: "p", text: "Welcome to Pulse Nova Entertainment." },
  {
    type: "p",
    text: 'These Terms of Use ("Terms") govern your access to and use of the website www.pulsenova.gg (the "Website"), operated by Pulse Nova Entertainment ("Pulse Nova", "we", "us", or "our").',
  },
  {
    type: "p",
    text: "By accessing or using this Website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you should discontinue use of the Website.",
  },
  { type: "h2", text: "2. Use of the Website" },
  {
    type: "p",
    text: "The Website is provided for informational purposes regarding Pulse Nova's services, projects, partnerships, and creator initiatives.",
  },
  {
    type: "p",
    text: "You agree to use the Website only for lawful purposes and in a manner that does not:",
  },
  {
    type: "ul",
    items: [
      "Violate any applicable laws or regulations",
      "Interfere with the operation or security of the Website",
      "Attempt to gain unauthorized access to any systems or data",
      "Copy, scrape, or extract content from the Website without permission",
    ],
  },
  {
    type: "p",
    text: "We reserve the right to restrict or terminate access to the Website if misuse is detected.",
  },
  { type: "h2", text: "3. Intellectual Property" },
  {
    type: "p",
    text: "All content on this Website, including but not limited to:",
  },
  {
    type: "ul",
    items: [
      "Text",
      "Graphics",
      "Logos",
      "Branding",
      "Images",
      "Videos",
      "Case studies",
      "Website design and layout",
    ],
  },
  {
    type: "p",
    text: "are owned by or licensed to Pulse Nova and are protected under applicable intellectual property laws.",
  },
  {
    type: "p",
    text: "You may not reproduce, distribute, modify, republish, or commercially exploit any content from this Website without prior written permission from Pulse Nova.",
  },
  {
    type: "p",
    text: "You may, however, reference or share links to the Website for non-commercial purposes.",
  },
  { type: "h2", text: "4. Portfolio and Case Study Content" },
  {
    type: "p",
    text: "The Website may feature portfolio content, campaign highlights, creator collaborations, and case studies.",
  },
  { type: "p", text: "Such content may include:" },
  {
    type: "ul",
    items: [
      "Brand collaborations",
      "Creator or influencer campaigns",
      "Campaign results or statistics",
      "Visual materials provided by partners",
    ],
  },
  {
    type: "p",
    text: "All trademarks, logos, and intellectual property belonging to third parties remain the property of their respective owners and are displayed for illustrative or portfolio purposes only.",
  },
  { type: "h2", text: "5. Third-Party Links" },
  {
    type: "p",
    text: "The Website may contain links to third-party platforms, including but not limited to social media platforms, creator channels, or partner websites.",
  },
  {
    type: "p",
    text: "Pulse Nova does not control and is not responsible for the content, privacy practices, or availability of these third-party websites.",
  },
  { type: "p", text: "Accessing such third-party platforms is done at your own risk." },
  { type: "h2", text: "6. Contact and Enquiries" },
  {
    type: "p",
    text: "Users may contact Pulse Nova through the contact form available on the Website.",
  },
  { type: "p", text: "By submitting an enquiry, you agree that:" },
  {
    type: "ul",
    items: [
      "The information you provide is accurate and not misleading",
      "Pulse Nova may contact you in response to your enquiry",
      "Submission of an enquiry does not create any contractual relationship",
    ],
  },
  {
    type: "p",
    text: "Pulse Nova reserves the right to decline or not respond to enquiries at its sole discretion.",
  },
  { type: "h2", text: "7. Disclaimer" },
  {
    type: "p",
    text: 'The Website and its contents are provided on an "as is" and "as available" basis.',
  },
  {
    type: "p",
    text: "While we strive to ensure that the information presented is accurate and up to date, Pulse Nova makes no representations or warranties regarding:",
  },
  {
    type: "ul",
    items: [
      "The accuracy or completeness of Website content",
      "The availability or uninterrupted operation of the Website",
      "The reliability of any information presented on the Website",
    ],
  },
  {
    type: "p",
    text: "To the fullest extent permitted by law, Pulse Nova disclaims liability for any loss or damage arising from the use of this Website.",
  },
  { type: "h2", text: "8. Limitation of Liability" },
  {
    type: "p",
    text: "To the maximum extent permitted by law, Pulse Nova shall not be liable for any indirect, incidental, consequential, or special damages arising from:",
  },
  {
    type: "ul",
    items: [
      "Use or inability to use the Website",
      "Reliance on any content available on the Website",
      "Errors, omissions, or interruptions in Website availability",
    ],
  },
  { type: "h2", text: "9. Changes to These Terms" },
  {
    type: "p",
    text: "Pulse Nova may update these Terms from time to time to reflect changes in our services, Website functionality, or legal requirements.",
  },
  {
    type: "p",
    text: "The updated Terms will be posted on this page with the revised \"Last updated\" date.",
  },
  {
    type: "p",
    text: "Your continued use of the Website constitutes acceptance of the updated Terms.",
  },
  { type: "h2", text: "10. Governing Law" },
  {
    type: "p",
    text: "These Terms shall be governed by and construed in accordance with the laws of Singapore, without regard to its conflict of law principles.",
  },
  {
    type: "p",
    text: "Any disputes arising from or relating to the use of this Website shall be subject to the exclusive jurisdiction of the courts of Singapore.",
  },
  { type: "h2", text: "11. Contact Us" },
  {
    type: "p",
    text: "If you have any questions regarding these Terms of Use, please contact us at:",
  },
  { type: "p", text: "Pulse Nova Entertainment" },
  { type: "p", text: "Email: business@pulsenova.gg" },
  { type: "p", text: "Website: www.pulsenova.gg" },
];
