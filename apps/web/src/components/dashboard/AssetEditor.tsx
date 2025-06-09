"use client";
import React, { useState, useRef } from 'react';
import { Asset } from './types';

interface AssetEditorProps {
  asset: Asset;
  onAssetChange: (asset: Asset) => void;
  onClose: () => void;
}

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  maxSize: number;
  label: string;
  icon: string;
}

interface ProblemCanvasNode {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'problem' | 'solution' | 'idea' | 'question' | 'note';
  color: string;
}

interface MindMapNode {
  id: string;
  x: number;
  y: number;
  text: string;
  connections: string[];
  category: 'main' | 'sub' | 'detail';
}

const MediaUpload = ({ onFileSelect, acceptedTypes, maxSize, label, icon }: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        isDragging
          ? 'border-[#6366F1] bg-[#6366F1]/5'
          : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-[#111827] mb-2">{label}</h3>
      <p className="text-sm text-[#6B7280] mb-4">
        Drag and drop your file here, or click to browse
      </p>
      <p className="text-xs text-[#6B7280] mb-4">
        Max size: {formatFileSize(maxSize)}
      </p>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors"
      >
        Choose File
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const ProblemCanvas = ({ onSave }: { onSave: (nodes: ProblemCanvasNode[]) => void }) => {
  const [nodes, setNodes] = useState<ProblemCanvasNode[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState<ProblemCanvasNode['type']>('problem');
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodeTypes = [
    { type: 'problem' as const, label: 'Problem', color: '#EF4444', icon: '❗' },
    { type: 'solution' as const, label: 'Solution', color: '#10B981', icon: '💡' },
    { type: 'idea' as const, label: 'Idea', color: '#6366F1', icon: '✨' },
    { type: 'question' as const, label: 'Question', color: '#F59E0B', icon: '❓' },
    { type: 'note' as const, label: 'Note', color: '#8B5CF6', icon: '📝' }
  ];

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isCreating) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeType = nodeTypes.find(nt => nt.type === selectedNodeType);
    const newNode: ProblemCanvasNode = {
      id: `node_${Date.now()}`,
      x,
      y,
      text: `New ${nodeType?.label || 'Node'}`,
      type: selectedNodeType,
      color: nodeType?.color || '#6366F1'
    };

    setNodes(prev => [...prev, newNode]);
    setIsCreating(false);
  };

  const updateNodeText = (nodeId: string, text: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, text } : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  };

  const handleSave = () => {
    onSave(nodes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#111827]">Problem Canvas</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors text-sm"
          >
            Save Canvas
          </button>
        </div>
      </div>

      {/* Node Type Selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
        <span className="text-sm text-[#6B7280] mr-2">Add:</span>
        {nodeTypes.map((nodeType) => (
          <button
            key={nodeType.type}
            onClick={() => {
              setSelectedNodeType(nodeType.type);
              setIsCreating(true);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isCreating && selectedNodeType === nodeType.type
                ? 'bg-white border-2 border-dashed text-[#111827]'
                : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB]'
            }`}
            style={{ borderColor: isCreating && selectedNodeType === nodeType.type ? nodeType.color : undefined }}
          >
            <span>{nodeType.icon}</span>
            <span>{nodeType.label}</span>
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`relative w-full h-96 bg-white border-2 border-dashed rounded-xl overflow-hidden ${
          isCreating ? 'border-[#6366F1] cursor-crosshair' : 'border-[#E5E7EB]'
        }`}
        style={{ backgroundColor: '#FAFBFC' }}
      >
        {nodes.length === 0 && !isCreating && (
          <div className="absolute inset-0 flex items-center justify-center text-[#6B7280]">
            <div className="text-center">
              <div className="text-4xl mb-2">🧠</div>
              <p className="font-medium">Visual Problem Solving</p>
              <p className="text-sm">Click a node type above, then click here to place it</p>
            </div>
          </div>
        )}

        {isCreating && (
          <div className="absolute inset-0 flex items-center justify-center text-[#6366F1] pointer-events-none">
            <div className="text-center">
              <div className="text-2xl mb-1">
                {nodeTypes.find(nt => nt.type === selectedNodeType)?.icon}
              </div>
              <p className="text-sm font-medium">
                Click to place {nodeTypes.find(nt => nt.type === selectedNodeType)?.label}
              </p>
            </div>
          </div>
        )}

        {/* Render Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute group"
            style={{ left: node.x - 60, top: node.y - 30 }}
          >
            <div
              className="min-w-[120px] p-2 rounded-lg shadow-lg border-2 bg-white text-center relative"
              style={{ borderColor: node.color }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <span style={{ color: node.color }}>
                  {nodeTypes.find(nt => nt.type === node.type)?.icon}
                </span>
                <button
                  onClick={() => deleteNode(node.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-[#EF4444] transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={node.text}
                onChange={(e) => updateNodeText(node.id, e.target.value)}
                className="w-full text-xs text-center bg-transparent border-none focus:outline-none resize-none"
                placeholder="Enter text..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-[#6B7280] bg-[#F9FAFB] p-3 rounded-lg">
        <p><strong>How to use:</strong> Use this visual canvas to break down problems, brainstorm solutions, and organize your creative process. Each node type serves a different purpose in your creative workflow.</p>
      </div>
    </div>
  );
};

const CharacterBuilder = ({ description, onChange }: { description: string; onChange: (desc: string) => void }) => {
  const [traits, setTraits] = useState<string[]>(['']);
  const [background, setBackground] = useState('');
  const [motivations, setMotivations] = useState('');
  const [relationships, setRelationships] = useState('');

  const addTrait = () => {
    setTraits(prev => [...prev, '']);
  };

  const updateTrait = (index: number, value: string) => {
    setTraits(prev => prev.map((trait, i) => i === index ? value : trait));
  };

  const removeTrait = (index: number) => {
    setTraits(prev => prev.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const combinedDescription = [
      description,
      traits.filter(t => t.trim()).length > 0 ? `\n\nTraits: ${traits.filter(t => t.trim()).join(', ')}` : '',
      background ? `\n\nBackground: ${background}` : '',
      motivations ? `\n\nMotivations: ${motivations}` : '',
      relationships ? `\n\nRelationships: ${relationships}` : ''
    ].join('').trim();
    
    onChange(combinedDescription);
  }, [traits, background, motivations, relationships, description, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Character Traits
        </label>
        <div className="space-y-2">
          {traits.map((trait, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={trait}
                onChange={(e) => updateTrait(index, e.target.value)}
                placeholder="e.g., Brave, Mysterious, Loyal"
                className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
              {traits.length > 1 && (
                <button
                  onClick={() => removeTrait(index)}
                  className="px-3 py-2 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTrait}
            className="text-sm text-[#6366F1] hover:text-[#5B5BD6] transition-colors"
          >
            + Add Trait
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Background Story
        </label>
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          rows={3}
          placeholder="Where did this character come from? What shaped them?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Motivations & Goals
        </label>
        <textarea
          value={motivations}
          onChange={(e) => setMotivations(e.target.value)}
          rows={3}
          placeholder="What drives this character? What do they want to achieve?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Relationships
        </label>
        <textarea
          value={relationships}
          onChange={(e) => setRelationships(e.target.value)}
          rows={3}
          placeholder="How does this character relate to others in your story?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

const LoreBuilder = ({ description, onChange }: { description: string; onChange: (desc: string) => void }) => {
  const [worldRules, setWorldRules] = useState('');
  const [history, setHistory] = useState('');
  const [cultures, setCultures] = useState('');
  const [geography, setGeography] = useState('');
  const [magic, setMagic] = useState('');

  React.useEffect(() => {
    const combinedDescription = [
      description,
      worldRules ? `\n\nWorld Rules: ${worldRules}` : '',
      history ? `\n\nHistory: ${history}` : '',
      cultures ? `\n\nCultures & Societies: ${cultures}` : '',
      geography ? `\n\nGeography: ${geography}` : '',
      magic ? `\n\nMagic/Technology: ${magic}` : ''
    ].join('').trim();
    
    onChange(combinedDescription);
  }, [worldRules, history, cultures, geography, magic, description, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          World Rules & Laws
        </label>
        <textarea
          value={worldRules}
          onChange={(e) => setWorldRules(e.target.value)}
          rows={3}
          placeholder="What are the fundamental rules that govern your world?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Historical Events
        </label>
        <textarea
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          rows={3}
          placeholder="What important events shaped this world?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Cultures & Societies
        </label>
        <textarea
          value={cultures}
          onChange={(e) => setCultures(e.target.value)}
          rows={3}
          placeholder="What cultures, races, or societies exist in this world?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Geography & Locations
        </label>
        <textarea
          value={geography}
          onChange={(e) => setGeography(e.target.value)}
          rows={3}
          placeholder="Describe the physical world, important locations, landmarks..."
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Magic System / Technology
        </label>
        <textarea
          value={magic}
          onChange={(e) => setMagic(e.target.value)}
          rows={3}
          placeholder="How does magic work? What technology exists? What are the limitations?"
          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export const AssetEditor = ({ asset, onAssetChange, onClose }: AssetEditorProps) => {
  const [title, setTitle] = useState(asset.name);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'basic' | 'enhanced' | 'canvas'>('basic');
  const [problemCanvasNodes, setProblemCanvasNodes] = useState<ProblemCanvasNode[]>([]);

  // Initialize description based on asset type
  React.useEffect(() => {
    if (asset.content.type === 'CHARACTER' && 'description' in asset.content) {
      setDescription(asset.content.description || '');
    } else if (asset.content.type === 'LORE' && 'description' in asset.content) {
      setDescription(asset.content.description || '');
    } else if (asset.content.type === 'IMAGE' && 'caption' in asset.content) {
      setDescription(asset.content.caption || '');
    } else if (asset.content.type === 'VIDEO' && 'description' in asset.content) {
      setDescription(asset.content.description || '');
    } else if (asset.content.type === 'AUDIO' && 'description' in asset.content) {
      setDescription(asset.content.description || '');
    }
  }, [asset]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const fileUrl = URL.createObjectURL(file);
      
      setTimeout(() => {
        setUploadProgress(100);
        
        const updatedAsset: Asset = {
          ...asset,
          name: title,
          updatedAt: new Date()
        };

        if (asset.content.type === 'IMAGE') {
          updatedAsset.content = {
            ...asset.content,
            url: fileUrl,
            altText: title,
            caption: description
          };
        } else if (asset.content.type === 'VIDEO') {
          updatedAsset.content = {
            ...asset.content,
            url: fileUrl,
            title: title,
            description: description
          };
        } else if (asset.content.type === 'AUDIO') {
          updatedAsset.content = {
            ...asset.content,
            url: fileUrl,
            title: title,
            description: description
          };
        }

        onAssetChange(updatedAsset);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = () => {
    const updatedAsset: Asset = {
      ...asset,
      name: title,
      updatedAt: new Date()
    };

    if (asset.content.type === 'CHARACTER') {
      updatedAsset.content = {
        ...asset.content,
        description: description
      };
    } else if (asset.content.type === 'LORE') {
      updatedAsset.content = {
        ...asset.content,
        description: description
      };
    } else if (asset.content.type === 'IMAGE') {
      updatedAsset.content = {
        ...asset.content,
        caption: description,
        altText: title
      };
    } else if (asset.content.type === 'VIDEO') {
      updatedAsset.content = {
        ...asset.content,
        title: title,
        description: description
      };
    } else if (asset.content.type === 'AUDIO') {
      updatedAsset.content = {
        ...asset.content,
        title: title,
        description: description
      };
    }

    onAssetChange(updatedAsset);
  };

  const getAssetIcon = () => {
    switch (asset.type) {
      case 'CHARACTER': return '👤';
      case 'STORYLINE': return '📖';
      case 'LORE': return '📚';
      case 'IMAGE': return '🎨';
      case 'VIDEO': return '🎬';
      case 'AUDIO': return '🎵';
      default: return '📄';
    }
  };

  const getAssetTypeLabel = () => {
    switch (asset.type) {
      case 'CHARACTER': return 'Character';
      case 'STORYLINE': return 'Storyline';
      case 'LORE': return 'Lore';
      case 'IMAGE': return 'Image';
      case 'VIDEO': return 'Video';
      case 'AUDIO': return 'Audio';
      default: return 'Asset';
    }
  };

  const isMediaAsset = ['IMAGE', 'VIDEO', 'AUDIO'].includes(asset.type);
  const hasMediaFile = isMediaAsset && 'url' in asset.content && asset.content.url;
  const showEnhancedBuilder = ['CHARACTER', 'LORE'].includes(asset.type);

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: '📝' },
    ...(showEnhancedBuilder ? [{ id: 'enhanced' as const, label: 'Builder', icon: '🔧' }] : []),
    { id: 'canvas' as const, label: 'Problem Canvas', icon: '🧠' }
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getAssetIcon()}</span>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none text-[#111827] min-w-0"
                placeholder={`Untitled ${getAssetTypeLabel()}`}
              />
              <div className="text-sm text-[#6B7280]">{getAssetTypeLabel()}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors text-sm font-medium"
        >
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#6366F1] border-[#6366F1]'
                  : 'text-[#6B7280] border-transparent hover:text-[#111827]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          {activeTab === 'basic' && (
            <>
              {/* Media Upload Section */}
              {isMediaAsset && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#111827]">Media File</h3>
                  
                  {hasMediaFile ? (
                    <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center text-white text-xl">
                            {getAssetIcon()}
                          </div>
                          <div>
                            <p className="font-medium text-[#111827]">File uploaded successfully</p>
                            <p className="text-sm text-[#6B7280]">Ready for use in your storyworld</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFileUpload(new File([], ''))}
                          className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isUploading ? (
                        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
                            <div>
                              <p className="font-medium text-[#111827]">Uploading...</p>
                              <p className="text-sm text-[#6B7280]">{uploadProgress}% complete</p>
                            </div>
                          </div>
                          <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                            <div 
                              className="bg-[#6366F1] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {asset.type === 'IMAGE' && (
                            <MediaUpload
                              onFileSelect={handleFileUpload}
                              acceptedTypes="image/*"
                              maxSize={10 * 1024 * 1024}
                              label="Upload Image"
                              icon="🎨"
                            />
                          )}
                          {asset.type === 'VIDEO' && (
                            <MediaUpload
                              onFileSelect={handleFileUpload}
                              acceptedTypes="video/*"
                              maxSize={100 * 1024 * 1024}
                              label="Upload Video"
                              icon="🎬"
                            />
                          )}
                          {asset.type === 'AUDIO' && (
                            <MediaUpload
                              onFileSelect={handleFileUpload}
                              acceptedTypes="audio/*"
                              maxSize={50 * 1024 * 1024}
                              label="Upload Audio"
                              icon="🎵"
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {isMediaAsset ? 'Description & Concept' : 'Description'}
                  </h3>
                  <span className="text-sm text-[#6B7280]">
                    {description.length}/1000 characters
                  </span>
                </div>
                
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={8}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                  placeholder={
                    isMediaAsset
                      ? `Describe this ${getAssetTypeLabel().toLowerCase()}... What is it about? What mood or story does it convey?`
                      : `Describe this ${getAssetTypeLabel().toLowerCase()}... What are the key characteristics, background, or important details?`
                  }
                />
                
                {isMediaAsset && (
                  <div className="bg-[#F0F4FF] border border-[#C7D2FE] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-[#6366F1] text-lg">💡</div>
                      <div>
                        <h4 className="font-medium text-[#1E1B4B] mb-1">Mind Mapping Feature</h4>
                        <p className="text-sm text-[#4C1D95]">
                          Use this description as a creative mind map. Describe concepts, moods, colors, themes, and ideas. 
                          This detailed description can later be used to generate or enhance visual content with AI tools.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'enhanced' && showEnhancedBuilder && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111827]">
                Enhanced {getAssetTypeLabel()} Builder
              </h3>
              
              {asset.type === 'CHARACTER' && (
                <CharacterBuilder 
                  description={description} 
                  onChange={setDescription} 
                />
              )}
              
              {asset.type === 'LORE' && (
                <LoreBuilder 
                  description={description} 
                  onChange={setDescription} 
                />
              )}
            </div>
          )}

          {activeTab === 'canvas' && (
            <ProblemCanvas
              onSave={(nodes) => {
                setProblemCanvasNodes(nodes);
              }}
            />
          )}

          {/* Metadata Section */}
          <div className="bg-[#FAFBFC] rounded-xl p-6 border border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Asset Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#6B7280]">Type:</span>
                <span className="ml-2 font-medium text-[#111827]">{getAssetTypeLabel()}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Status:</span>
                <span className="ml-2 font-medium text-[#111827]">
                  {asset.ipStatus === 'REGISTERED' ? 'Registered' : 'Draft'}
                </span>
              </div>
              <div>
                <span className="text-[#6B7280]">Visibility:</span>
                <span className="ml-2 font-medium text-[#111827]">
                  {asset.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                </span>
              </div>
              <div>
                <span className="text-[#6B7280]">Created:</span>
                <span className="ml-2 font-medium text-[#111827]">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetEditor; 