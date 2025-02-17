import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import { RiMailLine, RiCustomerServiceLine, RiTeamLine, RiQuestionLine } from 'react-icons/ri';

const contactOptions = [
  {
    title: 'General Inquiries',
    description: 'Questions about our products or services',
    icon: RiQuestionLine,
    email: 'info@ditoolz.com'
  },
  {
    title: 'Technical Support',
    description: 'Get help with technical issues',
    icon: RiCustomerServiceLine,
    email: 'support@ditoolz.com'
  },
  {
    title: 'Enterprise Sales',
    description: 'Learn about our enterprise solutions',
    icon: RiTeamLine,
    email: 'enterprise@ditoolz.com'
  },
  {
    title: 'Press & Media',
    description: 'Media inquiries and press kit requests',
    icon: RiMailLine,
    email: 'press@ditoolz.com'
  }
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'general'
      });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Get in touch with our team for support, inquiries, or partnership opportunities
        </p>
      </motion.div>

      {/* Contact Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard variant="cyber" className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-orbitron text-futuristic-silver mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-futuristic-silver/60 font-inter mb-4">
                    {option.description}
                  </p>
                  <a
                    href={`mailto:${option.email}`}
                    className="text-neon-cyan hover:text-holographic-teal transition-colors font-inter"
                  >
                    {option.email}
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <GlassCard variant="cyber" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-orbitron text-futuristic-silver mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-base-dark/40 border border-neon-cyan/20 rounded-lg text-futuristic-silver focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors font-inter"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-orbitron text-futuristic-silver mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-base-dark/40 border border-neon-cyan/20 rounded-lg text-futuristic-silver focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors font-inter"
                />
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-orbitron text-futuristic-silver mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-base-dark/40 border border-neon-cyan/20 rounded-lg text-futuristic-silver focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors font-inter"
              >
                <option value="general">General Inquiries</option>
                <option value="support">Technical Support</option>
                <option value="enterprise">Enterprise Sales</option>
                <option value="press">Press & Media</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-orbitron text-futuristic-silver mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-dark/40 border border-neon-cyan/20 rounded-lg text-futuristic-silver focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors font-inter"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-orbitron text-futuristic-silver mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 bg-base-dark/40 border border-neon-cyan/20 rounded-lg text-futuristic-silver focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors font-inter resize-none"
              />
            </div>

            <div className="flex justify-end">
              <NeonButton
                variant="primary"
                disabled={isSubmitting}
                onClick={() => {
                  const formEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleSubmit(formEvent);
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Contact; 