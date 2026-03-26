const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const contactSubmit = document.getElementById("contact-submit");

const inquiryTypeMap = {
  "General inquiry": "general-inquiry",
  Partnership: "partnership",
  "Supplier / Vendor": "supplier-vendor",
  Other: "other",
};

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const inquiryType = String(formData.get("inquiryType") || "General inquiry");
    const payload = {
      requestType: inquiryTypeMap[inquiryType] || "general-inquiry",
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      source: "website-contact-form",
      page: window.location.href,
    };

    if (contactSubmit) {
      contactSubmit.disabled = true;
      contactSubmit.textContent = "Submitting...";
    }

    formStatus.textContent = "Submitting inquiry...";

    try {
      const response = await fetch("https://email.api.exente-tech.com/v1/public/lead-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      contactForm.reset();
      formStatus.textContent = "Inquiry submitted successfully. We will review it during business hours.";
    } catch (error) {
      formStatus.textContent =
        "We could not submit your inquiry right now. Please email info@exente-tech.com or try again shortly.";
    } finally {
      if (contactSubmit) {
        contactSubmit.disabled = false;
        contactSubmit.textContent = "Submit Inquiry";
      }
    }
  });
}
