import React, { useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

// Lore Entry Component
const LoreEntryComponent = ({ node, updateAttributes }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { title, category, significance, connections } = node.attrs;

  const handleUpdate = (field: string, value: any) => {
    updateAttributes({ [field]: value });
  };

  const categories = ['history', 'culture', 'mythology', 'geography', 'technology', 'magic'];

  return (
    <NodeViewWrapper className="lore-entry-node">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 my-4 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
              📚
            </div>
            <div>
              <input
                type="text"
                value={title || ''}
                onChange={(e) => handleUpdate('title', e.target.value)}
                placeholder="Lore Entry Title"
                className="text-xl font-bold bg-transparent border-none outline-none placeholder-amber-400"
              />
              <div className="text-sm text-amber-600">World Lore</div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Category</label>
              <select
                value={category || 'history'}
                onChange={(e) => handleUpdate('category', e.target.value)}
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Significance</label>
              <textarea
                value={significance || ''}
                onChange={(e) => handleUpdate('significance', e.target.value)}
                placeholder="Why is this important to your world?"
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Connections</label>
              <input
                type="text"
                value={connections?.join(', ') || ''}
                onChange={(e) => handleUpdate('connections', e.target.value.split(',').map(t => t.trim()))}
                placeholder="e.g., The Great War, Ancient Magic, Lost Civilization"
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Details</label>
              <div className="border border-amber-200 rounded-md p-3 min-h-[150px]">
                <NodeViewContent className="prose prose-amber max-w-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// Tiptap Extension
export const LoreEntryNode = Node.create({
  name: 'loreEntry',
  group: 'block',
  content: 'block+',
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: 'New Lore Entry',
      },
      category: {
        default: 'history',
      },
      significance: {
        default: '',
      },
      connections: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="lore-entry"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'lore-entry' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LoreEntryComponent);
  },
});

export default LoreEntryNode;