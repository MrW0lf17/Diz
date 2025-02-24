import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import { RiTeamLine, RiHeartLine, RiRocketLine, RiLightbulbLine, RiCloseLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const benefits = [
  {
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and work-life balance',
    icon: RiRocketLine,
  },
  {
    title: 'Health & Wellness',
    description: 'Comprehensive health coverage and wellness programs',
    icon: RiHeartLine,
  },
  {
    title: 'Growth',
    description: 'Professional development budget and mentorship opportunities',
    icon: RiLightbulbLine,
  },
  {
    title: 'Team Events',
    description: 'Regular team building and social activities',
    icon: RiTeamLine,
  },
];

const openPositions = [
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Technical Support Specialist',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
  },
];

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    title: string;
    department: string;
    location: string;
    type: string;
  };
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  position,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    experience: '',
    coverLetter: '',
    resumeFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Resume file size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, resumeFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload resume file to storage
      let resumeUrl = '';
      if (formData.resumeFile) {
        const fileExt = formData.resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('job_applications')
          .upload(filePath, formData.resumeFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('job_applications')
          .getPublicUrl(filePath);

        resumeUrl = publicUrl;
      }

      // Create application record
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([{
          position_title: position.title,
          department: position.department,
          location: position.location,
          employment_type: position.type,
          applicant_name: formData.fullName,
          applicant_email: formData.email,
          phone_number: formData.phone,
          linkedin_url: formData.linkedIn,
          portfolio_url: formData.portfolio,
          years_of_experience: parseInt(formData.experience) || 0,
          cover_letter: formData.coverLetter,
          resume_url: resumeUrl,
          status: 'pending',
          applied_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      toast.success('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <GlassCard variant="cyber" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-orbitron text-futuristic-silver">
                  Apply for {position.title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-futuristic-silver/60 hover:text-futuristic-silver transition-colors"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      min="0"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-futuristic-silver mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-futuristic-silver mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    required
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-futuristic-silver mb-2">
                    Resume *
                  </label>
                  <input
                    type="file"
                    name="resumeFile"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full bg-black/20 border border-neon-cyan/20 rounded-lg px-4 py-2 text-futuristic-silver focus:outline-none focus:border-neon-cyan"
                  />
                  <p className="mt-1 text-xs text-futuristic-silver/60">
                    Max file size: 5MB. Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg font-orbitron text-futuristic-silver/60 hover:text-futuristic-silver transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-orbitron bg-gradient-cyber text-white transition-opacity hover:opacity-90"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Careers: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<typeof openPositions[0] | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          Join Our Mission
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Help us shape the future of AI-powered creative tools
        </p>
      </motion.div>

      {/* Culture Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <GlassCard variant="cyber" className="p-8">
          <h2 className="text-2xl font-orbitron text-futuristic-silver mb-6">
            Our Culture
          </h2>
          <div className="space-y-4 text-futuristic-silver/80 font-inter">
            <p>
              At DiToolz, we're building the future of creative AI tools in an environment that 
              values innovation, collaboration, and personal growth. Our team is made up of 
              passionate individuals who are excited about pushing the boundaries of what's possible.
            </p>
            <p>
              We believe in fostering an inclusive workplace where diverse perspectives are 
              celebrated and everyone has the opportunity to make an impact.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-orbitron text-futuristic-silver mb-8 text-center">
          Benefits & Perks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <GlassCard variant="cyber" className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-orbitron text-futuristic-silver mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-futuristic-silver/60 font-inter">
                    {benefit.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Open Positions Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-orbitron text-futuristic-silver mb-8 text-center">
          Open Positions
        </h2>
        <div className="space-y-4">
          {openPositions.map((position, index) => (
            <motion.div
              key={position.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <GlassCard variant="cyber" className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-orbitron text-futuristic-silver">
                      {position.title}
                    </h3>
                    <p className="text-sm text-futuristic-silver/60 font-inter">
                      {position.department} · {position.location} · {position.type}
                    </p>
                  </div>
                  <NeonButton
                    variant="primary"
                    size="sm"
                    className="min-w-[100px]"
                    onClick={() => setSelectedPosition(position)}
                  >
                    Apply Now
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <GlassCard variant="cyber" className="p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-orbitron text-futuristic-silver mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-lg text-futuristic-silver/80 font-inter mb-8">
            We're always looking for talented individuals to join our team. Send us your resume!
          </p>
          <Link to="/contact">
            <NeonButton variant="primary" size="lg">
              Get in Touch
            </NeonButton>
          </Link>
        </GlassCard>
      </motion.div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {selectedPosition && (
          <ApplicationFormModal
            isOpen={true}
            onClose={() => setSelectedPosition(null)}
            position={selectedPosition}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers; 