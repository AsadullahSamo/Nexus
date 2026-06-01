import { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I schedule a meeting?',
    answer: 'Go to Meetings and click Schedule Meeting. Search for a participant by name, pick a date and time, and submit. They will receive a notification and can accept or reject the request.',
  },
  {
    question: 'How do video calls work?',
    answer: 'Start a video call from the Chat page or meeting page by clicking the video icon in the chat header or in meeting card. The other person receives an incoming call and can respond accordingly',
  },
  {
    question: 'How do I upload and share documents?',
    answer: 'Go to Documents from the sidebar and click Upload Document. Supported formats are PDF, Word, Excel, and images up to 10MB. You can also preview PDFs directly in the website, and sign documents digitally using the e-signature feature.'
  },
  {
    question: 'How does messaging work?',
    answer: 'Click Messages in the sidebar to see all your conversations. You can start a new conversation by going to an investor or entrepreneur profile and clicking Message. All messages are delivered in real time.'
  },
  {
    question: 'How do I sign a document?',
    answer: 'In the Documents page, each document has a sign button (pen icon). Clicking it opens a signature pad where you can draw your signature. Once saved, the document is marked as signed and the signature is stored securely linked to that document.'
  },
  {
    question: 'How do I manage deals?',
    answer: 'The Deals section tracks your investment pipeline. You can create deals with a startup, set funding amounts, equity percentage, and track status through stages like Due Diligence, Term Sheet, Negotiation, and Closed.'
  },
  {
    question: 'How do payments and transactions work?',
    answer: 'Go to Payments from the sidebar to deposit funds, withdraw, or transfer to another user. All transactions are processed through Stripe and stored with a full history showing status, amount, and timestamp.'
  },
   {
    question: 'How do I update my profile?',
    answer: 'Go to Settings → Profile tab to update your name, bio, and photo. Entrepreneurs can add startup details like industry and funding needs. Investors can add investment preferences and portfolio companies.',
  },
  {
    question: 'How do I change my password?',
    answer: 'Go to Settings → Security tab. Enter your current password and your new password twice to confirm, and click Update Password.'
  },
   {
    question: 'How do I enable Two-Factor Authentication?',
    answer: 'Go to Settings → Security tab and click Enable under Two-Factor Authentication. An OTP will be shown — enter it to activate 2FA on your account.',
  },
];

const CATEGORIES = [
  'General Inquiry',
  'Technical Issue',
  'Account & Billing',
  'Meeting & Scheduling',
  'Documents & Signature',
  'Video Calling',
  'Payments',
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        {open
          ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
        }
      </button>
      {open && <p className="pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>}
    </div>
  );
};

export const HelpPage: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    category: '',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.category || !form.message.trim()) {
      setError('All fields are required.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!emailValid) {
        setError('Please enter a valid email address.');
        return;
      }

      if (form.message.trim().length < 20) {
        setError('Please describe your issue in at least 20 characters.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1000);
    };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions or get in touch with our team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <Mail size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Email Support</h2>
            <p className="text-sm text-gray-600 mt-2">We typically respond within 24 hours</p>
            <a
              href="mailto:support@businessnexus.com"
              className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              support@businessnexus.com
            </a>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <MessageCircle size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Community</h2>
            <p className="text-sm text-gray-600 mt-2">Connect with other users and share insights</p>
            <a
              href="mailto:community@businessnexus.com"
              className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              community@businessnexus.com
            </a>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <Phone size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Phone Support</h2>
            <p className="text-sm text-gray-600 mt-2">Available Monday–Friday, 9am–5pm EST</p>
            <a
              href="tel:+18005551234"
              className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              +1 (800) 555-1234
            </a>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody className="px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </CardBody>
      </Card>

       <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Still need help?</h2>
        </CardHeader>
        <CardBody>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle size={48} className="text-success-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Message received
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Thanks for reaching out. We'll get back to you at{' '}
                <span className="font-medium text-gray-700">{form.email}</span>{' '}
                within 24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: user?.name ?? '',
                    email: user?.email ?? '',
                    category: '',
                    message: '',
                  });
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
              {error && (
                <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-md px-4 py-3">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  fullWidth
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Mail size={16} />}
              >
                Send Message
              </Button>
            </form>
          )}
        </CardBody>
      </Card>

      <div className="text-center text-sm text-gray-500 space-x-4 pb-4">
        <Link to="/terms" className="hover:text-primary-600">Terms of Service</Link>
        <span>·</span>
        <Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
      </div>
    </div>
  );
};