import React from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export const ComparisonChart = ({ designs }) => {
  if (!designs || designs.length === 0) return null;

  // Prepare data for bar chart
  const barData = designs.map(design => ({
    name: design.name.split(' ')[0],
    energy: design.metrics.energyEfficiency,
    water: design.metrics.waterEfficiency,
    materials: design.metrics.materialsEfficiency ?? design.metrics.sustainabilityIndex,
    sustainability: design.metrics.sustainabilityIndex,
  }));

  // Prepare data for radar chart
  const radarData = designs.map(design => ({
    metric: design.name,
    energy: design.metrics.energyEfficiency,
    water: design.metrics.waterEfficiency,
    sustainability: design.metrics.sustainabilityIndex,
  }));

  // Cost comparison data
  const costData = designs.map(design => ({
    name: design.name.split(' ')[0],
    cost: design.metrics.estimatedCost,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-surface rounded-lg p-8 space-y-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-accent-lime mb-6">Sustainability Comparison</h2>

      {/* Sustainability Scores Bar Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-graphite rounded-md p-4 border border-dark-border"
      >
        <h3 className="text-lg font-semibold text-text-secondary mb-4">Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                color: '#f5f5f5'
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="energy" fill="#9cff57" name="Energy Efficiency" radius={[8, 8, 0, 0]} />
            <Bar dataKey="water" fill="#b794f6" name="Water Efficiency" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sustainability" fill="#ffd93d" name="Overall Index" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-graphite rounded-md p-4 border border-dark-border"
      >
        <h3 className="text-lg font-semibold text-text-secondary mb-4">Multi-dimensional Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2a2a2a" />
            <PolarAngleAxis dataKey="metric" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis stroke="#a0a0a0" />
            <Radar name="Energy" dataKey="energy" stroke="#9cff57" fill="#9cff57" fillOpacity={0.3} />
            <Radar name="Water" dataKey="water" stroke="#b794f6" fill="#b794f6" fillOpacity={0.3} />
            <Radar name="Sustainability" dataKey="sustainability" stroke="#ffd93d" fill="#ffd93d" fillOpacity={0.3} />
            <Legend wrapperStyle={{ color: '#f5f5f5' }} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Cost Comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-graphite rounded-md p-4 border border-dark-border"
      >
        <h3 className="text-lg font-semibold text-text-secondary mb-4">Estimated Project Costs</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                color: '#f5f5f5'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Bar dataKey="cost" fill="#ffad33" name="Estimated Cost" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Trend Lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="bg-dark-graphite rounded-md p-4 border border-dark-border"
      >
        <h3 className="text-lg font-semibold text-text-secondary mb-4">Metric Trends</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                color: '#f5f5f5'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#a8b566" strokeWidth={2} dot={false} name="Energy" />
            <Line type="monotone" dataKey="water" stroke="#b794f6" strokeWidth={2} dot={false} name="Water" />
            <Line type="monotone" dataKey="materials" stroke="#ff9966" strokeWidth={2} dot={false} name="Materials" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dark-border"
      >
        {designs.map((design, index) => {
          const best = designs.reduce((prev, curr) => 
            curr.metrics.sustainabilityIndex > prev.metrics.sustainabilityIndex ? curr : prev
          );
          const isBest = design.id === best.id;

          return (
            <motion.div
              key={design.id}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-md border transition-all ${
                isBest
                  ? 'bg-dark-panel border-accent-lime/30'
                  : 'bg-dark-graphite border-dark-border'
              }`}
            >
              <p className="text-sm font-semibold text-text-secondary mb-1">{design.name}</p>
              <div className="space-y-1">
                <p className="text-xs text-text-label">
                  Sustainability: <span className="text-accent-yellow font-bold">{design.metrics.sustainabilityIndex}%</span>
                </p>
                <p className="text-xs text-text-label">
                  Cost: <span className="text-accent-amber font-bold">${design.metrics.estimatedCost.toLocaleString()}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default ComparisonChart;
