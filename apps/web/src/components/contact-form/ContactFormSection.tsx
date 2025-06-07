"use client";
import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  enquiryId?: string;
  error?: string;
}

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Get the function URL - adjust this based on your Firebase project
      const functionUrl = process.env.NODE_ENV === 'production'
        ? 'https://us-central1-sia-vision.cloudfunctions.net/submitContactForm'
        : 'http://localhost:5001/sia-vision/us-central1/submitContactForm'; // For local development

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: SubmissionResponse = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", inquiryType: "", message: "" });
        console.log("Form submitted successfully:", result.enquiryId);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join-ecosystem" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-10">
        <div className="py-12 md:py-16 bg-white rounded-3xl shadow-xl max-w-4xl mx-auto border border-gray-200">
          {/* Section Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-center mb-12 text-creative-tech-on-surface">
            Let&#39;s Build the Future of Story, Together.
          </h2>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent bg-creative-tech-surface text-creative-tech-on-surface text-base placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent bg-creative-tech-surface text-creative-tech-on-surface text-base placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Inquiry Type Dropdown */}
            <div className="mb-6">
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent bg-creative-tech-surface text-creative-tech-on-surface text-base"
                required
              >
                <option value="">Select Area of Interest</option>
                <option value="general">General Enquiry / Feedback</option>
                <option value="sia-contribute">Become a Creator / IP Originator</option>
                <option value="new-ip">Collaborate / Build on Existing Storyworlds (SIA Genesis)</option>
                <option value="partnership">Partnership / Distribution Opportunities</option>
                <option value="technical">Platform & Technical Ideas</option>
                <option value="community">Join Our Community</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="mb-8">
              <textarea
                name="message"
                placeholder="Inspired by timeless tales or have a new vision? Tell us about the storyworlds you want to build, the lore you can contribute, or how you see us collaborating."
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent bg-creative-tech-surface text-creative-tech-on-surface text-base resize-vertical placeholder-gray-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-creative-tech-primary hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-4 px-12 rounded-lg text-lg shadow-lg transition duration-300 w-full md:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Submission Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                Thank you! Your message has been received successfully. We&#39;ll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                <p className="font-semibold mb-2">Sorry, there was an error sending your message.</p>
                {errorMessage && <p className="text-sm mb-2">Error: {errorMessage}</p>}
                <p>Please try again or contact us directly at <a href="mailto:connect@sia.vision" className="text-red-800 font-medium underline">connect@sia.vision</a></p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection; 