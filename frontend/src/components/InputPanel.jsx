import React from 'react';
import { motion } from 'framer-motion';

export const InputPanel = ({ 
  constraints, 
  onConstraintChange, 
  onGenerate, 
  isLoading 
}) => {
  const handleSliderChange = (key, value) => {
    onConstraintChange({
      ...constraints,
      [key]: value
    });
  };

  const handleSelectChange = (key, value) => {
    onConstraintChange({
      ...constraints,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-surface rounded-lg p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">Design Constraints</h2>

      {/* Area Slider */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-text-secondary">
          Project Area: <span className="text-text-primary font-bold">{constraints.area} sq ft</span>
        </label>
        <input
          type="range"
          min="300"
          max="2000"
          step="50"
          value={constraints.area}
          onChange={(e) => handleSliderChange('area', parseInt(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-dark-graphite rounded-lg appearance-none cursor-pointer accent-slate-500"
        />
        <div className="flex justify-between text-xs text-text-label mt-2">
          <span>300</span>
          <span>2000</span>
        </div>
      </div>

      {/* Budget Slider */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-text-secondary">
          Budget Level: <span className="text-text-primary font-bold">{constraints.budget}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={constraints.budget}
          onChange={(e) => handleSliderChange('budget', parseInt(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-dark-graphite rounded-lg appearance-none cursor-pointer accent-slate-500"
        />
        <div className="flex justify-between text-xs text-text-label mt-2">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Climate Type */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-text-secondary">Climate Type</label>
        <div className="flex">
          {['cold', 'moderate', 'hot'].map((type) => (
            <button
              key={type}
              onClick={() => handleSelectChange('climate', type)}
              disabled={isLoading}
              className={`py-2 px-3 font-medium transition-all flex-1 first:rounded-l-md last:rounded-r-md -ml-px ${
                constraints.climate === type
                  ? 'bg-dark-graphite border border-gray-500 text-text-primary'
                  : 'bg-dark-graphite border border-dark-border text-text-secondary hover:border-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sustainability Priority */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-text-secondary">Primary Focus</label>
        <div className="flex">
          {['energy', 'water', 'materials'].map((priority) => (
            <button
              key={priority}
              onClick={() => handleSelectChange('priority', priority)}
              disabled={isLoading}
              className={`py-2 px-3 font-medium transition-all flex-1 first:rounded-l-md last:rounded-r-md -ml-px ${
                constraints.priority === priority
                  ? 'bg-dark-graphite border border-gray-500 text-text-primary'
                  : 'bg-dark-graphite border border-dark-border text-text-secondary hover:border-gray-600'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={onGenerate}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className={`w-full py-3 px-6 rounded-md font-bold text-lg transition-all shadow-xl ${
          isLoading
            ? 'bg-dark-graphite text-text-label cursor-not-allowed'
            : 'bg-dark-graphite border border-gray-600 text-text-primary hover:shadow-2xl'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              ⚙️
            </motion.span>
            Generating Designs...
          </span>
        ) : (
          '🚀 Generate AI Designs'
        )}
      </motion.button>
    </motion.div>
  );
};

export default InputPanel;
