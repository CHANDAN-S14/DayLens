import React from 'react';
import { 
  DeviceMobile, 
  Watch, 
  Moon, 
  Monitor, 
  Heart, 
  Plugs, 
  CheckCircle, 
  Clock, 
  ArrowRight 
} from '@phosphor-icons/react';

const ICONS = {
  DeviceMobile,
  Watch,
  Moon,
  Monitor,
  Heart,
  Plugs
};

export default function DataCategoryCard({ category, onSelect }) {
  const IconComponent = ICONS[category.icon] || DeviceMobile;

  const statusStyles = {
    demo: "bg-sage-100 text-botanical-800 border-sage-200",
    manual: "bg-amber-50 text-amber-800 border-amber-200",
    planned: "bg-gray-100 text-charcoal-muted border-gray-200"
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-border-strong transition-all duration-300 ease-skill-base">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-100 text-botanical-800">
            <IconComponent className="w-5 h-5" weight="bold" />
          </div>
          <span className={`caption-4 px-2.5 py-0.5 rounded-full border font-semibold ${statusStyles[category.statusType] || statusStyles.demo}`}>
            {category.status}
          </span>
        </div>

        <h4 className="title-3 text-charcoal font-semibold mt-3">
          {category.name}
        </h4>
        <p className="caption-2 text-charcoal-muted mt-1 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-charcoal-muted caption-5">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{category.lastUpdated}</span>
        </div>
        <button
          onClick={() => onSelect(category)}
          className="caption-3 font-semibold text-botanical-800 hover:text-botanical-700 inline-flex items-center gap-1 flex-shrink-0 ml-2"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
