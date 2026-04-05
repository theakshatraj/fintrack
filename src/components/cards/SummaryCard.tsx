import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  subValue?: string;
  subValueColor?: string;
  icon?: React.ElementType;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  subValue,
  subValueColor = 'text-muted',
  icon: Icon,
}) => {
  return (
    <div className="card p-6 flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-text mono">{value}</h3>
        {subValue && (
          <p className={`text-xs font-medium ${subValueColor}`}>
            {subValue}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-bg3 rounded-xl text-accent">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
