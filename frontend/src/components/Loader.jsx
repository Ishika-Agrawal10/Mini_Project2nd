import React from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ status }) => {
  const steps = [
    { key: 'applying', label: 'Applying constraints...' },
    { key: 'generating', label: 'Generating design alternatives...' },
    { key: 'evaluating', label: 'Evaluating sustainability metrics...' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-surface rounded-lg p-12 shadow-2xl"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block mb-6"
        >
          <span className="text-6xl">🤖</span>
        </motion.div>

        <h3 className="text-2xl font-bold text-accent-lime mb-8">AI Design Generation</h3>

        {/* Progress Steps */}
        <div className="space-y-4 max-w-md mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                index <= currentStepIndex
                  ? 'bg-dark-graphite border border-accent-lime-soft/30'
                  : 'bg-dark-panel border border-dark-border opacity-50'
              }`}
            >
              <span className={`text-lg font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStepIndex
                  ? 'bg-accent-lime-soft text-dark-bg'
                  : index === currentStepIndex
                  ? 'bg-accent-yellow text-dark-bg'
                  : 'bg-dark-border text-text-label'
              }`}>
                {index < currentStepIndex ? '✓' : index === currentStepIndex ? '...' : index + 1}
              </span>
              <span className="text-text-secondary">{step.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-text-label mt-8 text-sm"
        >
          Optimizing designs for sustainability...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;
