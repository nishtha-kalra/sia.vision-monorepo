import React, { useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

// Character Profile Component
const CharacterProfileComponent = ({ node, updateAttributes }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { name, age, occupation, personality, appearance, backstory } = node.attrs;

  const handleUpdate = (field: string, value: any) => {
    updateAttributes({ [field]: value });
  };

  return (
    <NodeViewWrapper className="character-profile-node">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 my-4 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
              👤
            </div>
            <div>
              <input
                type="text"
                value={name || ''}
                onChange={(e) => handleUpdate('name', e.target.value)}
                placeholder="Character Name"
                className="text-xl font-bold bg-transparent border-none outline-none placeholder-purple-400"
              />
              <div className="text-sm text-purple-600">Character Profile</div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Age</label>
                <input
                  type="text"
                  value={age || ''}
                  onChange={(e) => handleUpdate('age', e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation || ''}
                  onChange={(e) => handleUpdate('occupation', e.target.value)}
                  placeholder="e.g., Detective"
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Personality Traits</label>
              <input
                type="text"
                value={personality?.join(', ') || ''}
                onChange={(e) => handleUpdate('personality', e.target.value.split(',').map(t => t.trim()))}
                placeholder="e.g., brave, curious, stubborn"
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Appearance</label>
              <textarea
                value={appearance || ''}
                onChange={(e) => handleUpdate('appearance', e.target.value)}
                placeholder="Describe the character's physical appearance..."
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-purple-500 focus:border-purple-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Backstory</label>
              <div className="border border-purple-200 rounded-md p-3 min-h-[100px]">
                <NodeViewContent className="prose prose-purple max-w-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// Tiptap Extension
export const CharacterProfileNode = Node.create({
  name: 'characterProfile',
  group: 'block',
  content: 'block+',
  draggable: true,

  addAttributes() {
    return {
      name: {
        default: 'Unnamed Character',
      },
      age: {
        default: '',
      },
      occupation: {
        default: '',
      },
      personality: {
        default: [],
      },
      appearance: {
        default: '',
      },
      backstory: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="character-profile"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'character-profile' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CharacterProfileComponent);
  },
});

export default CharacterProfileNode;