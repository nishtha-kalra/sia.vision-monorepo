import * as React from "react";

interface StoryCardContentProps {
  title: string;
  description: string;
}

export const StoryCardContent: React.FC<StoryCardContentProps> = ({
  title,
  description,
}) => {
  return (
    <article className="p-8">
      <header className="mb-6">
        <h2 className="mb-3 text-3xl font-bold leading-tight text-zinc-900">
          {title}
        </h2>
        <div className="w-12 bg-primary rounded-full h-[3px]" />
      </header>
      <p className="text-base leading-relaxed text-slate-600">{description}</p>
    </article>
  );
}; 