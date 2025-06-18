"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { CharacterProfileNode } from './editor/CharacterProfileNode';
import { LoreEntryNode } from './editor/LoreEntryNode';
import { Asset, Project } from './types';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';
import { useDebounce } from '@/hooks/useDebounce';

interface TiptapCanvasProps {
  currentProject?: Project;
  currentAsset?: Asset;
  onCreateAsset: (assetType: Asset['type']) => void;
  onAssetSelect: (asset: Asset) => void;
  onProjectSelect: (project: Project) => void;
}

const AIPanel = ({ 
  onTextExpansion,
  onImageGeneration,
  onPlotSuggestion,
  isVisible,
  onToggle
}: {
  onTextExpansion: () => void;
  onImageGeneration: () => void;
  onPlotSuggestion: () => void;
  isVisible: boolean;
  onToggle: () => void;
}) => {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-40"
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
          onClick={onTextExpansion}
          className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all duration-200"
        >
          <div className="font-medium text-[#111827]">✨ Expand Text</div>
          <div className="text-sm text-[#6B7280]">AI will enhance your selected text</div>
        </button>
        <button
          onClick={onImageGeneration}
          className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg transition-all duration-200"
        >
          <div className="font-medium text-[#111827]">🎨 Generate Image</div>
          <div className="text-sm text-[#6B7280]">Create visuals from descriptions</div>
        </button>
        <button
          onClick={onPlotSuggestion}
          className="w-full text-left p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all duration-200"
        >
          <div className="font-medium text-[#111827]">📖 Suggest Plot Points</div>
          <div className="text-sm text-[#6B7280]">Get AI-powered story suggestions</div>
        </button>
      </div>
    </div>
  );
};

export const TiptapCanvas = ({ 
  currentProject, 
  currentAsset, 
  onCreateAsset, 
  onAssetSelect, 
  onProjectSelect 
}: TiptapCanvasProps) => {
  const [showAI, setShowAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { saveAsset, generateTextExpansion, generateImageFromDescription, suggestPlotPoints } = useFirebaseFunctions();

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What's the title?';
          }
          return "Type '/' for commands, or just start writing...";
        },
      }),
      CharacterCount.configure({
        limit: 100000,
      }),
      CharacterProfileNode,
      LoreEntryNode,
    ],
    content: '<p>Start writing your story...</p>',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-12 py-8',
      },
    },
  });

  // Debounced content for auto-save
  const debouncedContent = useDebounce(editor?.getJSON(), 2000);

  // Auto-save functionality
  useEffect(() => {
    if (debouncedContent && currentAsset && !isSaving) {
      const saveContent = async () => {
        setIsSaving(true);
        try {
          await saveAsset({
            assetId: currentAsset.id,
            storyworldId: currentAsset.storyworldId,
            name: currentAsset.name,
            type: currentAsset.type,
            content: debouncedContent,
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      };
      saveContent();
    }
  }, [debouncedContent, currentAsset, saveAsset, isSaving]);

  // AI Functions
  const handleTextExpansion = useCallback(async () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (!selectedText) {
      alert('Please select some text to expand');
      return;
    }

    try {
      const result = await generateTextExpansion({
        text: selectedText,
        tone: 'creative',
        style: 'descriptive',
        context: {
          assetType: currentAsset?.type,
        }
      });

      if (result.success) {
        editor.chain().focus().deleteRange({ from, to }).insertContent(result.expandedText).run();
      }
    } catch (error) {
      console.error('Text expansion failed:', error);
    }
  }, [editor, generateTextExpansion, currentAsset]);

  const handleImageGeneration = useCallback(async () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    const description = selectedText || prompt('Describe the image you want to generate:');
    if (!description) return;

    try {
      const result = await generateImageFromDescription({
        description,
        style: 'concept art',
        assetType: currentAsset?.type,
        storyworldId: currentProject?.id,
      });

      if (result.success && result.imageUrl) {
        editor.chain().focus().setImage({ src: result.imageUrl }).run();
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  }, [editor, generateImageFromDescription, currentAsset, currentProject]);

  const handlePlotSuggestion = useCallback(async () => {
    if (!editor) return;
    
    const currentStory = editor.getText();
    
    try {
      const result = await suggestPlotPoints({
        currentStory: currentStory.substring(0, 1000), // First 1000 chars
        genre: currentProject?.genre,
        numberOfSuggestions: 3,
      });

      if (result.success && result.suggestions.length > 0) {
        // Show suggestions in a modal or panel
        const suggestion = result.suggestions[0];
        const insert = confirm(`Add this plot point?\n\n${suggestion.title}\n${suggestion.description}`);
        
        if (insert) {
          editor.chain().focus().insertContent(`\n\n## ${suggestion.title}\n\n${suggestion.description}\n\n`).run();
        }
      }
    } catch (error) {
      console.error('Plot suggestion failed:', error);
    }
  }, [editor, suggestPlotPoints, currentProject]);

  // Custom node insertion commands
  const insertCharacterProfile = () => {
    editor?.chain().focus().insertContent({
      type: 'characterProfile',
      attrs: {
        name: 'New Character',
      },
    }).run();
  };

  const insertLoreEntry = () => {
    editor?.chain().focus().insertContent({
      type: 'loreEntry',
      attrs: {
        title: 'New Lore Entry',
      },
    }).run();
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onProjectSelect(currentProject!)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{currentAsset?.name || currentProject?.name}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : null}
          </div>
          {editor && (
            <span className="text-sm text-[#6B7280]">
              {editor.storage.characterCount.characters()} characters
            </span>
          )}
          <button className="px-3 py-1.5 text-[#6B7280] hover:text-[#111827] text-sm transition-colors">
            Share
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-md hover:from-[#5B5BD6] hover:to-[#7C3AED] text-sm transition-all duration-200">
            Publish
          </button>
        </div>
      </div>

      {/* Floating Menu for slash commands */}
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white rounded-lg shadow-xl border border-[#E5E7EB] py-2 min-w-[200px]">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="font-bold">H1</span> Heading 1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="font-bold">H2</span> Heading 2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition-colors"
            >
              • Bullet List
            </button>
            <hr className="my-2 border-[#E5E7EB]" />
            <button
              onClick={insertCharacterProfile}
              className="w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition-colors text-purple-600"
            >
              👤 Character Profile
            </button>
            <button
              onClick={insertLoreEntry}
              className="w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition-colors text-amber-600"
            >
              📚 Lore Entry
            </button>
          </div>
        </FloatingMenu>
      )}

      {/* Bubble Menu for text formatting */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-[#2F3037] text-white rounded-lg shadow-xl px-2 py-1 flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 hover:bg-white/10 rounded text-sm font-bold transition-colors ${
                editor.isActive('bold') ? 'bg-white/20' : ''
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 hover:bg-white/10 rounded text-sm italic transition-colors ${
                editor.isActive('italic') ? 'bg-white/20' : ''
              }`}
            >
              I
            </button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button
              onClick={handleTextExpansion}
              className="p-2 hover:bg-white/10 rounded text-sm transition-colors"
              title="Expand with AI"
            >
              ✨
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* AI Assistant Panel */}
      <AIPanel
        onTextExpansion={handleTextExpansion}
        onImageGeneration={handleImageGeneration}
        onPlotSuggestion={handlePlotSuggestion}
        isVisible={showAI}
        onToggle={() => setShowAI(!showAI)}
      />
    </div>
  );
};