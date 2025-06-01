"use client";
import { useState } from "react";

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

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

    try {
      // Placeholder for backend integration
      console.log("Form submission:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData({ name: "", email: "", inquiryType: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join-ecosystem" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-10">
        <div className="py-12 md:py-16 bg-creative-tech-secondary rounded-3xl shadow-xl max-w-4xl mx-auto">
          {/* Section Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-center mb-6 text-neutral-800">
            Let&#39;s Build the Future of Story, Together.
          </h2>

          {/* Introductory Text */}
          <p className="text-lg text-neutral-700 text-center max-w-3xl mx-auto mb-12 leading-relaxed px-4">
            Sia.vision is more than a platform; it&#39;s a collaborative movement. Whether you have questions, ideas for the SIA genesis storyworld, want to propose your own unique IP or lore, or are interested in partnership opportunities, we&#39;re excited to hear from you. Every spark of imagination can contribute to our evolving universes.
          </p>

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
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent text-neutral-700 text-base"
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
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent text-neutral-700 text-base"
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
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent text-neutral-700 text-base"
                required
              >
                <option value="">Select Area of Interest</option>
                <option value="general">General Question/Feedback</option>
                <option value="sia-contribute">Contribute to SIA Genesis Storyworld</option>
                <option value="new-ip">Propose New IP / Story Concept</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="technical">Technical Query / Platform Idea</option>
                <option value="creator-waitlist">Join Creator Waitlist</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="mb-8">
              <textarea
                name="message"
                placeholder="Tell us about your vision, question, or how you'd like to contribute..."
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-creative-tech-primary focus:border-transparent text-neutral-700 text-base resize-vertical"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-600 text-white font-semibold py-4 px-12 rounded-lg text-lg shadow-lg transition duration-300 w-full md:w-auto"
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
                Sorry, there was an error sending your message. Please try again or contact us directly at connect@sia.vision
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection; 