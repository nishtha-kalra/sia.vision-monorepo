"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Asset } from './types';

interface StorylineEditorProps {
  asset: Asset;
  onAssetChange: (asset: Asset) => void;
  onClose: () => void;
}

interface SlashCommandProps {
  editor: any;
  onClose: () => void;
  position: { x: number; y: number };
}

interface ToolbarProps {
  editor: any;
}

interface ImageUploadProps {
  onImageAdd: (url: string, alt?: string) => void;
  onClose: () => void;
}

const ImageUploadModal = ({ onImageAdd, onClose }: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      // Create blob URL for preview (in real app, upload to storage service)
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setAltText(file.name.replace(/\.[^/.]+$/, ''));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageAdd(imageUrl, altText || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">Add Image</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            />
          </div>

          <div className="text-center text-[#6B7280]">or</div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full px-4 py-2 border-2 border-dashed border-[#E5E7EB] rounded-lg hover:border-[#6366F1] transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload from Computer'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Alt Text (optional)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageUrl.trim()}
              className="flex-1 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Toolbar = ({ editor }: ToolbarProps) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleAddImage = (url: string, alt?: string) => {
    editor.chain().focus().setImage({ src: url, alt }).run();
  };

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const ToolbarSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-1 border-r border-[#E5E7EB] pr-3 mr-3 last:border-r-0 last:pr-0 last:mr-0">
      <span className="text-xs text-[#6B7280] font-medium mr-2 hidden lg:block">{title}</span>
      {children}
    </div>
  );

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? 'bg-[#6366F1] text-white'
          : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-6 py-3">
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Format Section */}
        <ToolbarSection title="Format">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (⌘B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (⌘I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (⌘U)"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            🎨
          </ToolbarButton>
        </ToolbarSection>

        {/* Headings Section */}
        <ToolbarSection title="Headings">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
        </ToolbarSection>

        {/* Lists Section */}
        <ToolbarSection title="Lists">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            ☐
          </ToolbarButton>
        </ToolbarSection>

        {/* Alignment Section */}
        <ToolbarSection title="Align">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            ⫸
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            ≡
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            ⫷
          </ToolbarButton>
        </ToolbarSection>

        {/* Insert Section */}
        <ToolbarSection title="Insert">
          <ToolbarButton
            onClick={() => setShowImageModal(true)}
            title="Insert Image"
          >
            🖼️
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={showLinkInput}
            title="Insert Link"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            ⊞
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Insert Horizontal Rule"
          >
            ―
          </ToolbarButton>
        </ToolbarSection>

        {/* Special Section */}
        <ToolbarSection title="Special">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            ❝
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            {'{}'}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            title="Subscript"
          >
            X₂
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            title="Superscript"
          >
            X²
          </ToolbarButton>
        </ToolbarSection>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mt-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (https://...)"
              className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLink();
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
              autoFocus
            />
            <button
              onClick={handleAddLink}
              disabled={!linkUrl.trim()}
              className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add Link
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <ImageUploadModal
          onImageAdd={handleAddImage}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

const SlashCommands = ({ editor, onClose, position }: SlashCommandProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const commands = [
    {
      name: 'Heading 1',
      icon: 'H1',
      description: 'Large section heading',
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      name: 'Heading 2', 
      icon: 'H2',
      description: 'Medium section heading',
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      name: 'Heading 3',
      icon: 'H3', 
      description: 'Small section heading',
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      name: 'Bullet List',
      icon: '•',
      description: 'Create a bulleted list',
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: 'Numbered List',
      icon: '1.',
      description: 'Create a numbered list', 
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: 'Task List',
      icon: '☐',
      description: 'Create a task list with checkboxes',
      command: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      name: 'Quote',
      icon: '❝',
      description: 'Create a blockquote',
      command: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      name: 'Code Block',
      icon: '{}',
      description: 'Create a code block',
      command: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      name: 'Image',
      icon: '🖼️',
      description: 'Insert an image',
      command: () => {
        const url = window.prompt('Image URL');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      name: 'Table',
      icon: '⊞',
      description: 'Insert a table',
      command: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      name: 'Horizontal Rule',
      icon: '―',
      description: 'Insert a horizontal divider',
      command: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  const executeCommand = (command: () => void) => {
    command();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(commands[selectedIndex].command);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, commands, onClose]);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-[#E5E7EB] p-2 max-w-xs z-50"
      style={{
        left: position.x,
        top: position.y + 20,
      }}
    >
      <div className="text-xs text-[#6B7280] px-3 py-2 border-b border-[#F3F4F6]">
        Choose a block type
      </div>
      <div className="max-h-80 overflow-y-auto">
        {commands.map((command, index) => (
          <button
            key={command.name}
            onClick={() => executeCommand(command.command)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors ${
              index === selectedIndex ? 'bg-[#F0F4FF] text-[#6366F1]' : 'text-[#111827]'
            }`}
          >
            <span className="text-lg font-mono w-6 text-center">{command.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{command.name}</div>
              <div className="text-xs text-[#6B7280] truncate">{command.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const BubbleMenuComponent = ({ editor }: { editor: any }) => {
  const formatButtons = [
    {
      name: 'Bold',
      icon: 'B',
      isActive: () => editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: 'Italic', 
      icon: 'I',
      isActive: () => editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: 'Underline',
      icon: 'U',
      isActive: () => editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: 'Strike',
      icon: 'S',
      isActive: () => editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: 'Highlight',
      icon: '🎨',
      isActive: () => editor.isActive('highlight'),
      command: () => editor.chain().focus().toggleHighlight().run(),
    },
    {
      name: 'Link',
      icon: '🔗',
      isActive: () => editor.isActive('link'),
      command: () => {
        const url = window.prompt('URL');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
    },
  ];

  return (
    <div className="flex items-center bg-[#111827] rounded-lg shadow-xl overflow-hidden">
      {formatButtons.map((button) => (
        <button
          key={button.name}
          onClick={button.command}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            button.isActive()
              ? 'bg-[#6366F1] text-white'
              : 'text-[#D1D5DB] hover:text-white hover:bg-[#374151]'
          }`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export const StorylineEditor = ({ asset, onAssetChange, onClose }: StorylineEditorProps) => {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState(asset.name);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Enter a heading...`;
          }
          if (node.type.name === 'paragraph') {
            return 'Start writing your story... Type "/" for quick commands or use the toolbar above for formatting options.';
          }
          return 'Continue writing...';
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      CharacterCount,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Typography,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#6366F1] underline hover:text-[#5B5BD6] cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
    ],
    content: asset.content.type === 'STORYLINE' ? asset.content.tiptapJSON : {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Chapter 1' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Once upon a time...' }],
        },
      ],
    },
    onUpdate: ({ editor }) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      setIsAutoSaving(true);
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave(editor.getJSON(), editor.getText());
        setIsAutoSaving(false);
        setLastSaved(new Date());
      }, 1500);
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state;
      const { from } = selection;
      
      try {
        const coords = editor.view.coordsAtPos(from);
        const text = editor.getText();
        const beforeCursor = text.slice(Math.max(0, from - 10), from);
        
        if (beforeCursor.endsWith('/')) {
          setSlashMenuPosition({ x: coords.left, y: coords.top });
          setShowSlashMenu(true);
        } else {
          setShowSlashMenu(false);
        }
      } catch (error) {
        setShowSlashMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-slate max-w-none focus:outline-none min-h-[500px] p-6',
        style: 'line-height: 1.7; font-size: 18px;',
      },
    },
  });

  const handleSave = useCallback((tiptapJSON: any, plainText: string) => {
    if (asset.content.type === 'STORYLINE') {
      const updatedAsset: Asset = {
        ...asset,
        name: title,
        content: {
          ...asset.content,
          tiptapJSON,
          plainText,
        },
        updatedAt: new Date(),
      };
      onAssetChange(updatedAsset);
    }
  }, [asset, title, onAssetChange]);

  const handleManualSave = useCallback(() => {
    if (editor) {
      handleSave(editor.getJSON(), editor.getText());
      setLastSaved(new Date());
    }
  }, [editor, handleSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }
  }, [handleManualSave]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-[#6B7280]">Loading story editor...</div>
        </div>
      </div>
    );
  }

  const content = editor.getText();
  const characterCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed

  return (
    <div className="h-full bg-white flex flex-col" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 text-[#6B7280] hover:text-[#111827] transition-colors rounded-lg hover:bg-[#F9FAFB]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Storyworld
          </button>
          
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">📖</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none text-[#111827] flex-1 min-w-0"
              placeholder="Untitled Story"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[#6B7280] text-right">
            {isAutoSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : lastSaved ? (
              <div>
                <div>Saved at {lastSaved.toLocaleTimeString()}</div>
                <div className="text-xs">{wordCount} words • {readingTime} min read</div>
              </div>
            ) : (
              <div>
                <div>Draft</div>
                <div className="text-xs">{wordCount} words • {readingTime} min read</div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleManualSave}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Writing Area */}
      <div className="flex-1 bg-gradient-to-br from-[#FAFBFC] via-[#F9FAFB] to-[#F3F4F6] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Writing Zone Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-lg font-medium text-[#111827] mb-1">Story Writing Area</h2>
                <p className="text-sm text-[#6B7280]">
                  Focus on your narrative. Use the toolbar above or type "/" for quick formatting commands.
                </p>
              </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white shadow-sm border border-[#E5E7EB] mx-6 my-6 rounded-xl overflow-hidden">
              <div className="relative">
                {editor && (
                  <>
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <BubbleMenuComponent editor={editor} />
                    </BubbleMenu>
                    
                    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <div className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-1">
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB] rounded transition-colors"
                        >
                          <strong>H1</strong> Heading 1
                        </button>
                        <button
                          onClick={() => editor.chain().focus().setParagraph().run()}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB] rounded transition-colors"
                        >
                          ¶ Paragraph
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB] rounded transition-colors"
                        >
                          • Bullet List
                        </button>
                      </div>
                    </FloatingMenu>
                  </>
                )}
                
                <EditorContent 
                  editor={editor}
                  className="focus-within:outline-none"
                />
                
                {showSlashMenu && (
                  <SlashCommands
                    editor={editor}
                    onClose={() => setShowSlashMenu(false)}
                    position={slashMenuPosition}
                  />
                )}
              </div>
            </div>

            {/* Writing Stats */}
            <div className="px-6 pb-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6 text-[#6B7280]">
                    <span><strong className="text-[#111827]">{wordCount}</strong> words</span>
                    <span><strong className="text-[#111827]">{characterCount}</strong> characters</span>
                    <span><strong className="text-[#111827]">{readingTime}</strong> min read</span>
                    <span className="flex items-center gap-1">
                      📖 <span className="text-[#111827]">Storyline</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[#6B7280]">
                    <span>Press <kbd className="px-2 py-0.5 bg-[#F3F4F6] rounded text-xs font-mono">⌘S</kbd> to save</span>
                    <span>Type <kbd className="px-2 py-0.5 bg-[#F3F4F6] rounded text-xs font-mono">/</kbd> for commands</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorylineEditor; 