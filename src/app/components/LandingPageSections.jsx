"use client";

import FadeIn from "./FadeIn";
import OrnamentalDivider from "./OrnamentalDivider";
import ServicesSection from "./ServicesSection";
import MakeupSection from "./MakeupSection";
import MenuSection from "./MenuSection";
import DecorSection from "./DecorSection";
import WeddingsSection from "./WeddingsSection";
import TestimonialsSection from "./TestimonialsSection";
import GallerySection from "./GallerySection";
import CategoriesSection from "./CategoriesSection";
import PackagesSection from "./PackagesSection";
import ContactSection from "./ContactSection";

export default function LandingPageSections(props) {
  const {
    testimonialIndex, setTestimonialIndex,
    testimonialPaused, setTestimonialPaused,
    lightboxIndex, openLightbox, closeLightbox, navigateLightbox,
    contact, setContact, contactSent, setContactSent,
    contactLoading, contactError, handleContact,
    CATEGORY_GROUPS, EVENT_CATEGORIES,
  } = props;

  return (
    <>
      <FadeIn><ServicesSection /></FadeIn>
      <OrnamentalDivider />
      <FadeIn><MakeupSection /></FadeIn>
      <OrnamentalDivider />
      <FadeIn direction="right"><MenuSection /></FadeIn>
      <OrnamentalDivider />
      <FadeIn><DecorSection /></FadeIn>
      <OrnamentalDivider />
      <FadeIn><WeddingsSection /></FadeIn>
      <OrnamentalDivider />
      <TestimonialsSection
        testimonialIndex={testimonialIndex}
        setTestimonialIndex={setTestimonialIndex}
        testimonialPaused={testimonialPaused}
        setTestimonialPaused={setTestimonialPaused}
      />
      <OrnamentalDivider />
      <FadeIn>
        <GallerySection
          lightboxIndex={lightboxIndex}
          openLightbox={openLightbox}
          closeLightbox={closeLightbox}
          navigateLightbox={navigateLightbox}
        />
      </FadeIn>
      <OrnamentalDivider />
      <FadeIn>
        <CategoriesSection CATEGORY_GROUPS={CATEGORY_GROUPS} EVENT_CATEGORIES={EVENT_CATEGORIES} />
      </FadeIn>
      <OrnamentalDivider />
      <FadeIn><PackagesSection /></FadeIn>
      <OrnamentalDivider />
      <FadeIn>
        <ContactSection
          contact={contact}
          setContact={setContact}
          contactSent={contactSent}
          setContactSent={setContactSent}
          contactLoading={contactLoading}
          contactError={contactError}
          handleContact={handleContact}
        />
      </FadeIn>
    </>
  );
}
