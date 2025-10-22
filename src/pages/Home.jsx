import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, BarChart3, Shield, Clock, Zap, Users } from 'lucide-react';

const Home = () => {
  const features = [
    {
      name: '3 Test Inboxes',
      description: 'Test deliverability across Gmail, Outlook, and Yahoo',
      icon: Mail,
    },
    {
      name: 'Real-time Reports',
      description: 'Get detailed analytics on where your emails land in under 5 minutes',
      icon: BarChart3,
    },
    {
      name: 'Spam Detection',
      description: 'Identify if your emails are being marked as spam or promotions',
      icon: Shield,
    },
    {
      name: 'Quick Results',
      description: 'Complete testing process typically takes less than 5 minutes',
      icon: Clock,
    },
    {
      name: 'Shareable Reports',
      description: 'Share results with your team via unique links',
      icon: Users,
    },
    {
      name: 'Export Options',
      description: 'Download reports as PDF for documentation and analysis',
      icon: Zap,
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Create Test',
      description: 'Generate a unique test code and get test inbox addresses'
    },
    {
      step: 2,
      title: 'Send Email',
      description: 'Send an email from your account to all test addresses with the test code'
    },
    {
      step: 3,
      title: 'Automatic Analysis',
      description: 'Our system checks each inbox for your test email'
    },
    {
      step: 4,
      title: 'Get Report',
      description: 'Receive detailed deliverability report with scores and insights'
    }
  ];

  return (
    <div className="bg-white">
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Test Email Deliverability
              <span className="block text-indigo-200">Like a Pro</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Ensure your emails reach the inbox. Test across multiple providers and get 
              detailed reports on spam placement, promotions tabs, and deliverability scores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-test"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Start Free Test
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-md !text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive email deliverability insights in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-indigo-600">{step.step}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Tool</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional email testing with enterprise-grade features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.name}
                  className="bg-white p-6 rounded-lg shadow-sm hover-lift border border-gray-200"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Improve Your Email Deliverability?
          </h2>
          <Link
            to="/create-test"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md !text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Start Your First Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;