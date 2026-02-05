import React from 'react';
import { motion } from 'framer-motion';

export const DesignCard = ({ design, isBest, index, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
      className={`relative rounded-lg overflow-hidden transition-all ${
        isBest
          ? 'bg-dark-surface shadow-2xl ring-1 ring-accent-lime/30'
          : 'bg-dark-surface hover:ring-1 hover:ring-dark-border/60'
      }`}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-dark-border/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{design.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{design.name}</h3>
              <p className="text-xs text-text-label">Sustainable alternative</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <motion.button
                onClick={() => onToggleFavorite(design)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-xl transition-colors"
              >
                {isFavorite ? '❤️' : '🤍'}
              </motion.button>
            )}
            {isBest && (
              <span className="bg-accent-lime text-dark-bg px-3 py-1 rounded-md text-xs font-semibold">
                Best Match
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-5">
        {/* Metrics Strip */}
        <div className="flex items-center gap-3 bg-dark-graphite/60 rounded-md px-4 py-3 divide-x divide-dark-border/60">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wide text-text-label">Energy</p>
            <p className="text-lg font-semibold text-text-primary">{design.metrics.energyEfficiency}%</p>
          </div>
          <div className="flex-1 pl-3">
            <p className="text-[11px] uppercase tracking-wide text-text-label">Water</p>
            <p className="text-lg font-semibold text-text-primary">{design.metrics.waterEfficiency}%</p>
          </div>
          <div className="flex-1 pl-3">
            <p className="text-[11px] uppercase tracking-wide text-text-label">Carbon</p>
            <p className="text-sm font-semibold text-text-primary">{design.metrics.carbonFootprint}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Overview</h4>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              <li>{design.description}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Suggested Materials</h4>
            <div className="flex flex-wrap gap-2">
              {design.materials.map((material, i) => (
                <span
                  key={i}
                  className="bg-dark-graphite text-xs px-3 py-1 rounded-md border border-dark-border text-text-secondary"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Key Features</h4>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              {design.keyFeatures.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Sustainability Strategies</h4>
            <div className="flex flex-wrap gap-2">
              {design.strategies.slice(0, 3).map((strategy, i) => (
                <span
                  key={i}
                  className="bg-dark-graphite text-xs px-2 py-1 rounded-md border border-dark-border text-text-secondary"
                >
                  {strategy.replace(/-/g, ' ')}
                </span>
              ))}
              {design.strategies.length > 3 && (
                <span className="bg-dark-graphite text-xs px-2 py-1 rounded-md border border-dark-border text-text-label">
                  +{design.strategies.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-dark-border/60 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-text-label mb-1">Estimated Cost</p>
            <p className="text-lg font-semibold text-accent-yellow">${design.metrics.estimatedCost.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md bg-dark-graphite border border-dark-border text-text-secondary"
            >
              Details
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md bg-dark-graphite border border-dark-border text-text-secondary"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
