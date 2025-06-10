"use client";
import React, { useState, useEffect } from 'react';
import { Project, Asset } from './types';
import { StoryworldGallery } from './StoryworldGallery';

interface StoryworldProps {
  project?: Project | null;
  onProjectChange?: (project: Project | null) => void;
  onCreateAsset?: (assetType: Asset['type']) => void;
}

const StoryworldHeader = ({ 
  project, 
  onSave, 
  isEditing, 
  onToggleEdit,
  onBackToGallery 
}: { 
  project: Project | null; 
  onSave: (updates: Partial<Project>) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  onBackToGallery: () => void;
}) => {
  const [title, setTitle] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');

  useEffect(() => {
    setTitle(project?.name || '');
    setDescription(project?.description || '');
  }, [project]);

  const handleSave = () => {
    onSave({ name: title, description });
    onToggleEdit();
  };

  if (!project) return null;

  return (
    <div className="bg-white border-b border-[#E5E7EB] px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={onBackToGallery}
              className="flex items-center gap-2 px-3 py-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Storyworlds</span>
            </button>
            <div className="w-px h-6 bg-[#E5E7EB]"></div>
            
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold text-[#111827] bg-transparent border-2 border-[#E5E7EB] rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#6366F1]"
                    placeholder="Storyworld Title"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-[#6B7280] bg-transparent border-2 border-[#E5E7EB] rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:border-[#6366F1]"
                    placeholder="Describe your storyworld..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={onToggleEdit}
                      className="px-4 py-2 bg-[#F3F4F6] text-[#6B7280] rounded-lg hover:bg-[#E5E7EB] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[#111827] mb-2">
                    {project.name}
                  </h1>
                  <p className="text-[#6B7280] text-lg mb-4">
                    {project.description || 'No description yet'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      project.visibility === 'PUBLIC' 
                        ? 'bg-[#10B981]/10 text-[#10B981]' 
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}>
                      {project.visibility === 'PUBLIC' ? '🌍 Public' : '🔒 Private'}
                    </span>
                    <span className="text-[#6B7280]">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex gap-2 ml-6">
              <button
                onClick={onToggleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] text-[#6B7280] rounded-lg hover:bg-[#E5E7EB] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateStoryworldForm = ({ 
  onCreateStoryworld 
}: { 
  onCreateStoryworld: (project: Omit<Project, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateStoryworld({
      name: name.trim(),
      description: description.trim(),
      visibility,
      coverImageUrl: coverImageUrl.trim() || undefined,
      stats: {
        totalAssets: 0,
        characters: 0,
        storylines: 0,
        loreEntries: 0
      }
    });

    // Reset form
    setName('');
    setDescription('');
    setVisibility('PRIVATE');
    setCoverImageUrl('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            Create New Storyworld
          </h2>
          <p className="text-[#6B7280]">
            Build your creative universe with characters, storylines, and lore
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Storyworld Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              placeholder="e.g., Cyberpunk Norse Saga"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
              placeholder="Describe your storyworld, its setting, themes, or key elements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-4 border-2 border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#D1D5DB] transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="PRIVATE"
                  checked={visibility === 'PRIVATE'}
                  onChange={() => setVisibility('PRIVATE')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  visibility === 'PRIVATE' ? 'border-[#6366F1] bg-[#6366F1]' : 'border-[#D1D5DB]'
                }`}>
                  {visibility === 'PRIVATE' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-[#111827]">🔒 Private</div>
                  <div className="text-sm text-[#6B7280]">Only you can see this storyworld</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border-2 border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#D1D5DB] transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="PUBLIC"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  visibility === 'PUBLIC' ? 'border-[#6366F1] bg-[#6366F1]' : 'border-[#D1D5DB]'
                }`}>
                  {visibility === 'PUBLIC' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-[#111827]">🌍 Public</div>
                  <div className="text-sm text-[#6B7280]">Anyone can discover this storyworld</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6366F1] text-white font-medium rounded-lg hover:bg-[#5B5BD6] transition-colors"
          >
            Create Storyworld
          </button>
        </form>
      </div>
    </div>
  );
};

const StoryworldStats = ({ project }: { project: Project }) => {
  const stats = [
    { label: 'Assets', value: '23', icon: '📄' },
    { label: 'Characters', value: '8', icon: '👤' },
    { label: 'Storylines', value: '5', icon: '📖' },
    { label: 'Collaborators', value: '1', icon: '👥' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Storyworld = ({ project, onProjectChange, onCreateAsset }: StoryworldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showGallery, setShowGallery] = useState(!project);

  const handleCreateStoryworld = (newProject: Omit<Project, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    const createdProject: Project = {
      ...newProject,
      id: `project_${Date.now()}`,
      ownerId: 'current_user', // TODO: Get from auth
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onProjectChange?.(createdProject);
    setShowCreateForm(false);
    setShowGallery(false);
  };

  const handleProjectSelect = (selectedProject: Project) => {
    onProjectChange?.(selectedProject);
    setShowGallery(false);
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    setShowGallery(false);
  };

  const handleBackToGallery = () => {
    setShowGallery(true);
    setShowCreateForm(false);
    onProjectChange?.(null);
  };

  const handleSaveProject = (updates: Partial<Project>) => {
    if (!project) return;
    
    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };

    onProjectChange?.(updatedProject);
  };

  if (showGallery) {
    return (
      <StoryworldGallery
        onProjectSelect={handleProjectSelect}
        onCreateNew={handleShowCreateForm}
      />
    );
  }

  if (showCreateForm) {
    return (
      <div className="h-full bg-[#FAFBFC] flex items-center justify-center">
        <div className="w-full max-w-4xl px-6">
          <CreateStoryworldForm onCreateStoryworld={handleCreateStoryworld} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#111827] mb-2">No Storyworld Selected</h3>
          <p className="text-[#6B7280] mb-4">Create a new storyworld or select an existing one to get started.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors"
          >
            Create New Storyworld
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FAFBFC] flex flex-col">
      <StoryworldHeader
        project={project}
        onSave={handleSaveProject}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onBackToGallery={handleBackToGallery}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <StoryworldStats project={project} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div 
              onClick={() => onCreateAsset?.('CHARACTER')}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center text-white text-xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Create Character</h3>
                  <p className="text-sm text-[#6B7280]">Add a new character to your storyworld</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => onCreateAsset?.('STORYLINE')}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white text-xl">
                  📖
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Write Storyline</h3>
                  <p className="text-sm text-[#6B7280]">Start a new chapter or scene</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => onCreateAsset?.('LORE')}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center text-white text-xl">
                  📚
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Define Lore</h3>
                  <p className="text-sm text-[#6B7280]">Build your world's history and rules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-lg">
                <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center text-white">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#111827]">Created "Aria Shadowblade" character</p>
                  <p className="text-sm text-[#6B7280]">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-lg">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center text-white">
                  📖
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#111827]">Updated "Chapter 1: The Awakening"</p>
                  <p className="text-sm text-[#6B7280]">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyworld; 