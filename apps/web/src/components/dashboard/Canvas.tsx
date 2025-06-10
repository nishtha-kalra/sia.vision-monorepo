"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Asset, Project } from './types';

interface CanvasProps {
  currentProject?: Project;
  currentAsset?: Asset;
  onCreateAsset: (assetType: Asset['type']) => void;
  onAssetSelect: (asset: Asset) => void;
  onProjectSelect: (project: Project) => void;
}

// Sample project for demo
const sampleProject: Project = {
  id: 'sw1',
  ownerId: 'user1',
  name: 'Cyberpunk Norse Saga',
  description: 'A futuristic reimagining of Norse mythology where gods exist as AI entities in a cyberpunk world.',
  coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=240&fit=crop',
  visibility: 'PRIVATE',
  createdAt: new Date('2024-06-01'),
  updatedAt: new Date('2024-06-08'),
  stats: {
    totalAssets: 23,
    characters: 8,
    storylines: 5,
    loreEntries: 10
  }
};

// Simple inline toolbar that appears on text selection
const InlineToolbar = ({ 
  position,
  onFormat,
  onCreateAsset
}: { 
  position: { x: number; y: number } | null;
  onFormat: (format: string) => void;
  onCreateAsset: (type: Asset['type']) => void;
}) => {
  if (!position) return null;

  return (
    <div 
      className="fixed bg-[#2F3037] text-white rounded-lg shadow-xl px-2 py-1 z-50 flex items-center gap-1"
      style={{ 
        left: position.x, 
        top: position.y - 50,
        transform: 'translateX(-50%)'
      }}
    >
      <button
        onClick={() => onFormat('bold')}
        className="p-2 hover:bg-white/10 rounded text-sm font-medium transition-colors"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="p-2 hover:bg-white/10 rounded text-sm italic transition-colors"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => onFormat('link')}
        className="p-2 hover:bg-white/10 rounded transition-colors"
        title="Link"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="w-px h-4 bg-white/20 mx-1"></div>
      <button
        onClick={() => onCreateAsset('CHARACTER')}
        className="p-2 hover:bg-white/10 rounded text-xs transition-colors"
        title="Create Character"
      >
        👤
      </button>
      <button
        onClick={() => onCreateAsset('LORE')}
        className="p-2 hover:bg-white/10 rounded text-xs transition-colors"
        title="Add to Lore"
      >
        📚
      </button>
    </div>
  );
};

// Slash command menu
const SlashMenu = ({ 
  position,
  onInsert,
  onCreateAsset,
  searchTerm
}: { 
  position: { x: number; y: number } | null;
  onInsert: (type: string) => void;
  onCreateAsset: (type: Asset['type']) => void;
  searchTerm: string;
}) => {
  if (!position) return null;

  const commands = [
    { label: 'Heading 1', value: 'h1', icon: 'H1', description: 'Big section heading' },
    { label: 'Heading 2', value: 'h2', icon: 'H2', description: 'Medium section heading' },
    { label: 'Heading 3', value: 'h3', icon: 'H3', description: 'Small section heading' },
    { label: 'Bullet List', value: 'bulletList', icon: '•', description: 'Create a simple bulleted list' },
    { label: 'Numbered List', value: 'numberedList', icon: '1.', description: 'Create a list with numbering' },
    { label: 'Quote', value: 'quote', icon: '❝', description: 'Capture a quote' },
    { label: 'Divider', value: 'divider', icon: '—', description: 'Visually divide blocks' },
    { label: 'Character', value: 'character', icon: '👤', description: 'Create a character profile', isAsset: true },
    { label: 'Lore Entry', value: 'lore', icon: '📚', description: 'Add world-building lore', isAsset: true },
    { label: 'Image', value: 'image', icon: '🖼️', description: 'Generate concept art', isAsset: true },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="fixed bg-white rounded-lg shadow-xl border border-[#E5E7EB] py-2 z-50 min-w-80"
      style={{ 
        left: position.x, 
        top: position.y + 20
      }}
    >
      {filteredCommands.map((cmd, index) => (
        <button
          key={cmd.value}
          onClick={() => {
            if (cmd.isAsset) {
              onCreateAsset(cmd.value.toUpperCase() as Asset['type']);
            } else {
              onInsert(cmd.value);
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F3F4F6] transition-colors text-left"
        >
          <span className="w-8 text-center text-lg">{cmd.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-[#111827]">{cmd.label}</div>
            <div className="text-sm text-[#6B7280]">{cmd.description}</div>
          </div>
        </button>
      ))}
      {filteredCommands.length === 0 && (
        <div className="px-4 py-3 text-[#6B7280] text-sm">
          No matching commands
        </div>
      )}
    </div>
  );
};

// Minimal AI assistant
const AIAssistant = ({ 
  onCreateAsset,
  isVisible,
  onToggle
}: {
  onCreateAsset: (type: Asset['type']) => void;
  isVisible: boolean;
  onToggle: () => void;
}) => {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#6366F1] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#5B5BD6] transition-all duration-200 z-40"
        title="AI Assistant"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-4 w-80 z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#111827]">AI Assistant</h3>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onCreateAsset('CHARACTER')}
          className="w-full text-left p-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <div className="font-medium text-[#111827]">✨ Create character</div>
          <div className="text-sm text-[#6B7280]">Generate a new character profile</div>
        </button>
        <button
          onClick={() => onCreateAsset('STORYLINE')}
          className="w-full text-left p-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <div className="font-medium text-[#111827]">📖 Develop plot</div>
          <div className="text-sm text-[#6B7280]">Expand your storyline</div>
        </button>
        <button
          onClick={() => onCreateAsset('IMAGE')}
          className="w-full text-left p-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <div className="font-medium text-[#111827]">🎨 Generate art</div>
          <div className="text-sm text-[#6B7280]">Create concept visuals</div>
        </button>
      </div>
    </div>
  );
};

// Main editor component - Notion-style
const NotionEditor = ({ 
  content, 
  onChange,
  onCreateAsset,
  placeholder
}: { 
  content: string;
  onChange: (content: string) => void;
  onCreateAsset: (type: Asset['type']) => void;
  placeholder: string;
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [localContent, setLocalContent] = useState(content);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState<{ x: number; y: number } | null>(null);
  const [slashSearch, setSlashSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localContent !== content) {
        onChange(localContent);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localContent, content, onChange]);

  // Handle text selection for inline toolbar
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && isFocused) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selection.toString().trim());
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  }, [isFocused]);

  // Handle slash commands
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      setTimeout(() => {
        const textarea = editorRef.current;
        if (textarea) {
          const rect = textarea.getBoundingClientRect();
          const lines = localContent.substring(0, textarea.selectionStart).split('\n').length;
          const lineHeight = 24; // Approximate line height
          
          setSlashPosition({
            x: rect.left + 20,
            y: rect.top + (lines * lineHeight) + 40
          });
          setShowSlashMenu(true);
          setSlashSearch('');
        }
      }, 0);
    } else if (e.key === 'Escape') {
      setShowSlashMenu(false);
      setSlashPosition(null);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalContent(value);

    // Check for slash command typing
    if (showSlashMenu) {
      const lines = value.split('\n');
      const currentLine = lines[lines.length - 1];
      const slashIndex = currentLine.lastIndexOf('/');
      
      if (slashIndex !== -1) {
        setSlashSearch(currentLine.substring(slashIndex + 1));
      } else {
        setShowSlashMenu(false);
        setSlashPosition(null);
      }
    }
  };

  const handleFormat = (format: string) => {
    console.log('Format:', format);
    setSelectedText('');
    setSelectionPosition(null);
  };

  const handleInsert = (type: string) => {
    console.log('Insert:', type);
    setShowSlashMenu(false);
    setSlashPosition(null);
  };

  const handleAssetCreate = (type: Asset['type']) => {
    onCreateAsset(type);
    setShowSlashMenu(false);
    setSlashPosition(null);
    setSelectedText('');
    setSelectionPosition(null);
  };

  const wordCount = localContent.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={localContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-none outline-none resize-none placeholder-[#9CA3AF] p-12"
          style={{ 
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontSize: '18px',
            lineHeight: '1.6',
            maxWidth: '100%'
          }}
        />

        {/* Inline toolbar */}
        <InlineToolbar
          position={selectionPosition}
          onFormat={handleFormat}
          onCreateAsset={handleAssetCreate}
        />

        {/* Slash command menu */}
        <SlashMenu
          position={slashPosition}
          onInsert={handleInsert}
          onCreateAsset={handleAssetCreate}
          searchTerm={slashSearch}
        />

        {/* Word count - subtle bottom right */}
        {wordCount > 0 && (
          <div className="absolute bottom-6 right-6 text-sm text-[#9CA3AF] bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {wordCount} words
          </div>
        )}
      </div>
    </div>
  );
};

export const Canvas = ({ 
  currentProject = sampleProject, 
  currentAsset, 
  onCreateAsset, 
  onAssetSelect, 
  onProjectSelect 
}: CanvasProps) => {
  // Dynamic content based on asset type
  const getAssetContent = () => {
    if (currentAsset) {
      switch (currentAsset.type) {
        case 'CHARACTER':
          return `# ${currentAsset.name}\n\n*Character Profile*\n\n## Background\n\nDescribe this character's background, personality, and key traits...\n\n## Appearance\n\nWhat does this character look like?\n\n## Motivation\n\nWhat drives this character? What are their goals and fears?\n\n## Relationships\n\nHow does this character relate to others in your story?`;
        
        case 'STORYLINE':
          return `# ${currentAsset.name}\n\n*Storyline Outline*\n\n## Summary\n\nBrief overview of this storyline...\n\n## Key Events\n\n1. Opening scene\n2. Inciting incident\n3. Rising action\n4. Climax\n5. Resolution\n\n## Characters Involved\n\nWho are the main characters in this storyline?`;
        
        case 'LORE':
          return `# ${currentAsset.name}\n\n*World Building & Lore*\n\n## Overview\n\nWhat is this lore entry about?\n\n## Significance\n\nWhy is this important to your world?\n\n## Related Elements\n\nHow does this connect to other parts of your story?`;
        
        case 'IMAGE':
          return `# ${currentAsset.name}\n\n*Visual Concept*\n\n## Description\n\nDescribe what this image should show...\n\n## Style Notes\n\nWhat visual style or mood should this convey?\n\n## Usage Context\n\nHow will this image be used in your story?`;
        
        default:
          return `# ${currentAsset.name}\n\nStart creating your ${currentAsset.type.toLowerCase()}...`;
      }
    }
    
    return `# ${currentProject.name}\n\n*${currentProject.description}*\n\n## Chapter 1: The Awakening\n\nIn the neon-lit streets of Neo-Asgard, Aria Shadowblade moved through the crowds like a digital ghost. Her neural interface hummed with the familiar electric pulse of the network, connecting her consciousness to the vast web of data that had become humanity's new mythology.\n\nThe old gods were dead—or so the corporations wanted everyone to believe. But Aria knew better. In the deepest layers of the network, she had heard their whispers.\n\nThe rain fell in sheets across the chrome and glass towers, each droplet catching the holographic advertisements that painted the night in electric blues and fierce magentas. It was in this moment, suspended between the analog world of flesh and the digital realm of infinite possibility, that Aria felt the first tremor of something ancient stirring in the code.`;
  };

  const getAssetPlaceholder = () => {
    if (currentAsset) {
      switch (currentAsset.type) {
        case 'CHARACTER':
          return "Describe your character's personality, background, and key traits...";
        case 'STORYLINE':
          return "Outline your story's plot, key events, and character arcs...";
        case 'LORE':
          return "Add world-building details, history, or important background information...";
        case 'IMAGE':
          return "Describe the visual concept you want to create...";
        default:
          return `Start writing your ${currentAsset.type.toLowerCase()}...`;
      }
    }
    return "Type '/' for commands, or just start writing...";
  };

  const [editorContent, setEditorContent] = useState(getAssetContent());
  const [showAI, setShowAI] = useState(false);

  // Update content when asset changes
  React.useEffect(() => {
    setEditorContent(getAssetContent());
  }, [currentAsset?.id]);

  const getHeaderTitle = () => {
    if (currentAsset) {
      const typeLabel = currentAsset.type.charAt(0) + currentAsset.type.slice(1).toLowerCase();
      return currentAsset.name === `New ${currentAsset.type.toLowerCase()}` 
        ? `New ${typeLabel}` 
        : currentAsset.name;
    }
    return currentProject.name;
  };

  const getBackAction = () => {
    if (currentAsset) {
      return () => onProjectSelect(currentProject);
    }
    return () => onProjectSelect(currentProject);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
        <button
          onClick={getBackAction()}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{getHeaderTitle()}</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Saved</span>
          </div>
          <button className="px-3 py-1.5 text-[#6B7280] hover:text-[#111827] text-sm transition-colors">
            Share
          </button>
          <button className="px-3 py-1.5 bg-[#6366F1] text-white rounded-md hover:bg-[#5B5BD6] text-sm transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Clean editor */}
      <NotionEditor
        content={editorContent}
        onChange={setEditorContent}
        onCreateAsset={onCreateAsset}
        placeholder={getAssetPlaceholder()}
      />

      {/* Minimal AI assistant */}
      <AIAssistant
        onCreateAsset={onCreateAsset}
        isVisible={showAI}
        onToggle={() => setShowAI(!showAI)}
      />
    </div>
  );
}; 