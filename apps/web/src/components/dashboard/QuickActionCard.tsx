import { QuickAction } from './types';

interface QuickActionCardProps {
  action: QuickAction;
  onClick?: () => void;
}

export const QuickActionCard = ({ action, onClick }: QuickActionCardProps) => {
  return (
    <article
      className="group p-6 bg-white rounded-xl border border-[#E5E7EB] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:border-[#D1D5DB] hover:bg-[#FAFBFC]"
      onClick={onClick}
    >
      <div className="flex gap-4 items-start">
        <div 
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${action.color}`}
        >
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 font-semibold text-[#111827] text-lg">
            {action.title}
          </h3>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            {action.description}
          </p>
        </div>
        <svg
          className="group-hover:translate-x-1 w-5 h-5 transition-all duration-200 ease-in-out text-[#9CA3AF] group-hover:text-[#6B7280] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </article>
  );
}; 