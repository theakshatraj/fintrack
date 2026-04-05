import React from 'react';

interface InsightCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  color?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  color = 'text-accent',
}) => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 bg-bg3 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold text-text mono">{value}</h3>
        {subValue && (
          <p className="text-xs font-medium text-muted">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
