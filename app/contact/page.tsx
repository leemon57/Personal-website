import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Leave your contact information for ${profile.name}.`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="layout">
      <article className="contact-page">
        <header className="contact-header">
          <p className="caps">Contact</p>
          <h1>Leave your info</h1>
          <p className="lede muted">
            If a role or project seems like a good fit, leave a note here and I will
            message back by email.
          </p>
        </header>
        <div data-reveal>
          <ContactForm />
        </div>
      </article>
    </div>
  );
}
