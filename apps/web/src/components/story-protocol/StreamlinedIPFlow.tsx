"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useStoryProtocol } from '@/hooks/useStoryProtocol';
import { useAuthState } from '@/hooks/useAuth';
import FirebaseAIService, { ImageAnalysisResult, StoryProtocolAttributes } from '../../lib/firebaseAI';
import { useFirebaseFunctions } from '@/hooks/useFirebaseFunctions';

interface Asset {
  id: string;
  name: string;
  type: string;
  description?: string;
  content?: any;
  storyworldIds?: string[];
  imageUrl?: string;
}

interface StreamlinedIPFlowProps {
  asset: Asset;
  storyworld?: { name: string; genre: string; themes?: string[] };
  onClose: () => void;
  onSuccess: (result: any) => void;
}

type FlowStep = 'license' | 'metadata' | 'confirm' | 'processing' | 'success';

interface IPRegistration {
  id: string;
  status: 'DRAFT' | 'PENDING' | 'GENERATING_METADATA' | 'UPLOADING_METADATA' | 'REGISTERING_IP' | 'COMPLETED' | 'FAILED';
  pilTemplate: string;
  customMetadata?: any;
  aiPrompt?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    message?: string;
  }>;
  ipId?: string;
  txHash?: string;
  lastError?: string;
}

const PIL_TEMPLATES = [
  {
    id: 'non-commercial-social-remixing',
    name: 'Non-Commercial Social Remixing',
    description: 'Perfect for sharing and remixing with attribution',
    icon: '🤝',
    features: ['✅ Free to use', '✅ Remixing allowed', '✅ Attribution required', '❌ No commercial use']
  },
  {
    id: 'commercial-use',
    name: 'Commercial Use',
    description: 'Allow commercial use with revenue sharing',
    icon: '💼',
    features: ['✅ Commercial use allowed', '✅ 10% revenue share', '✅ Attribution required', '✅ Global territory']
  },
  {
    id: 'commercial-remix',
    name: 'Commercial Remix',
    description: 'Commercial derivatives with lower royalty',
    icon: '🎨',
    features: ['✅ Commercial derivatives', '✅ 5% revenue share', '✅ Attribution required', '✅ Remix friendly']
  },
  {
    id: 'creative-commons',
    name: 'Creative Commons Attribution',
    description: 'Open sharing with attribution only',
    icon: '🌍',
    features: ['✅ Completely open', '✅ Attribution required', '✅ No restrictions', '✅ Community friendly']
  }
];

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const StreamlinedIPFlow: React.FC<StreamlinedIPFlowProps> = ({
  asset,
  storyworld,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('license');
  const [selectedPIL, setSelectedPIL] = useState('non-commercial-social-remixing');
  const [customMetadata, setCustomMetadata] = useState({
    title: asset.name,
    description: asset.description || '',
    attributes: [] as Array<{ trait_type: string; value: string }>
  });

  // Update metadata when asset changes
  useEffect(() => {
    setCustomMetadata(prev => ({
      ...prev,
      title: asset.name,
      description: asset.description || ''
    }));
  }, [asset.name, asset.description]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [registration, setRegistration] = useState<IPRegistration | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [aiMetadata, setAiMetadata] = useState<StoryProtocolAttributes | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const { 
    createIPRegistration, 
    processIPRegistration, 
    getIPRegistrationStatus,
    generateIPMetadata 
  } = useStoryProtocol();

  const { updateAsset } = useFirebaseFunctions();
  const [user] = useAuthState();

  // Check for existing registration on mount instead of continuous polling
  useEffect(() => {
    const checkExistingRegistration = async () => {
      try {
        const result = await getIPRegistrationStatus({ assetId: asset.id });
        if (result.success && result.registration) {
          console.log('Found existing registration:', result.registration);
          setRegistration(result.registration);
          
          if (result.registration.status === 'COMPLETED') {
            setCurrentStep('success');
          } else if (result.registration.status === 'FAILED') {
            setCurrentStep('confirm');
          } else if (['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(result.registration.status)) {
            setCurrentStep('processing');
          }
        }
      } catch (error) {
        console.error('Failed to check existing registration:', error);
      }
    };

    checkExistingRegistration();
  }, [asset.id, getIPRegistrationStatus]);

  // Manual status check function (replaces continuous polling)
  const checkRegistrationStatus = useCallback(async () => {
    if (!registration) return;
    
    try {
      const statusResult = await getIPRegistrationStatus({ registrationId: registration.id });
      if (statusResult.success) {
        setRegistration(statusResult.registration);
        
        if (statusResult.registration.status === 'COMPLETED') {
          setCurrentStep('success');
        } else if (statusResult.registration.status === 'FAILED') {
          setCurrentStep('confirm');
        }
      }
    } catch (error) {
      console.error('Failed to check registration status:', error);
    }
  }, [registration, getIPRegistrationStatus]);

  // Enhanced AI metadata generation with Firebase AI
  const generateAIMetadata = useCallback(async () => {
    if (!asset.imageUrl || typeof window === 'undefined') return;
    
    setIsAnalyzingImage(true);
    try {
      // Analyze image with Firebase AI
      const analysis = await FirebaseAIService.analyzeImage(asset.imageUrl);
      setAiAnalysis(analysis);

      // Generate Story Protocol attributes with storyworld context
      const storyAttributes = await FirebaseAIService.generateStoryAttributes(
        asset.imageUrl,
        customMetadata.title,
        customMetadata.description,
        asset.type,
        storyworld ? {
          name: storyworld.name,
          genre: storyworld.genre,
          themes: storyworld.themes || []
        } : undefined
      );
      setAiMetadata(storyAttributes);

              // Update metadata with AI insights
        setCustomMetadata(prev => ({
          ...prev,
          description: analysis.description || prev.description,
          attributes: [
            ...(prev.attributes || []),
            // Visual analysis attributes
            { trait_type: 'Visual Type', value: analysis.visualAttributes.visualType },
            { trait_type: 'Art Genre', value: analysis.visualAttributes.artGenre },
            { trait_type: 'Mood', value: analysis.visualAttributes.mood },
            { trait_type: 'Art Style', value: analysis.visualAttributes.style },
            // Story Protocol attributes
            { trait_type: 'Narrative Role', value: storyAttributes.narrativeRole },
            { trait_type: 'Story Arc', value: storyAttributes.storyArc },
            { trait_type: 'Emotional Tone', value: storyAttributes.emotionalTone },
            { trait_type: 'Significance', value: storyAttributes.significance },
            { trait_type: 'Creative Complexity', value: storyAttributes.creativeComplexity },
            { trait_type: 'Originality Score', value: storyAttributes.originalityScore.toString() },
            { trait_type: 'Collaboration Potential', value: storyAttributes.collaborationPotential },
            { trait_type: 'Commercial Viability', value: storyAttributes.commercialViability },
            { trait_type: 'Adaptation Potential', value: storyAttributes.adaptationPotential }
          ]
        }));

    } catch (error) {
      console.error('Firebase AI analysis failed:', error);
    } finally {
      setIsAnalyzingImage(false);
    }
  }, [asset.imageUrl, customMetadata.title, customMetadata.description, storyworld]);

  // Auto-analyze image when component mounts for IMAGE assets
  useEffect(() => {
    if (asset.type === 'IMAGE' && asset.imageUrl && !aiAnalysis) {
      generateAIMetadata();
    }
  }, [asset.type, asset.imageUrl, aiAnalysis, generateAIMetadata]);

  const handleGenerateMetadata = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingMetadata(true);
    try {
      // Enhanced prompt with context for better NFT-style metadata
      const enhancedPrompt = `
Asset Details:
- Name: ${customMetadata.title}
- Type: ${asset.type}
- Current Description: ${customMetadata.description || 'No description'}
${asset.storyworldIds?.length ? `- Storyworld Context: Part of a creative universe` : ''}

User Request: ${aiPrompt.trim()}

Please generate rich NFT-style metadata including:
1. Enhanced title (if needed)
2. Compelling description
3. Valuable attributes like: Rarity, Power Level, Origin, Era, Faction, Element, Mood, Art Style, Creator Role, Story Significance, Collectibility, Special Abilities, Visual Traits, Emotional Resonance, Cultural Impact, etc.

Focus on making this asset discoverable and valuable in IP marketplaces.
      `.trim();

      const result = await generateIPMetadata({
        assetId: asset.id,
        aiPrompt: enhancedPrompt,
        customAttributes: customMetadata.attributes
      });

      if (result.success) {
        setCustomMetadata(prev => ({
          // Only update title if AI provided one AND it's different from current
          title: result.metadata.title && result.metadata.title !== prev.title ? result.metadata.title : prev.title,
          // Only update description if AI provided one AND it's different from current
          description: result.metadata.description && result.metadata.description !== prev.description ? result.metadata.description : prev.description,
          // Merge AI attributes with existing custom attributes
          attributes: [
            ...prev.attributes,
            ...(result.metadata.attributes || []).filter((aiAttr: { trait_type: string; value: string }) => 
              !prev.attributes.some(existingAttr => existingAttr.trait_type === aiAttr.trait_type)
            )
          ]
        }));
      }
    } catch (error) {
      console.error('Failed to generate metadata:', error);
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleStartRegistration = async () => {
    if (!selectedPIL) {
      alert('Please select a license template');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createIPRegistration({
        assetId: asset.id,
        pilTemplate: selectedPIL,
        customMetadata,
        aiPrompt
      });

      if (result.success && result.registrationId) {
        console.log('✅ Registration result:', result);
        setRegistration({
          id: result.registrationId,
          status: (result.status as IPRegistration['status']) || 'PENDING',
          pilTemplate: selectedPIL,
          customMetadata,
          aiPrompt,
          statusHistory: []
        });

        if (result.status === 'COMPLETED') {
          setCurrentStep('success');
        } else {
          setCurrentStep('processing');
          
          // Start the processing if it's a new registration
          if (result.status === 'DRAFT' || result.status === 'PENDING') {
            await processIPRegistration({ registrationId: result.registrationId });
          }
          
          // Start polling for status updates
          checkRegistrationStatus();
        }
      } else {
        throw new Error(result.error || 'Failed to create registration');
      }
    } catch (error: any) {
      console.error('❌ Failed to start registration:', error);
      
      // Handle specific error cases
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        alert('This asset already has an IP registration in progress or completed. Please check your IP assets.');
      } else {
        alert(`Failed to start registration: ${error.message || 'Unknown error'}`);
      }
      
      setIsProcessing(false);
    }
  };

  const addCustomAttribute = () => {
    setCustomMetadata(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setCustomMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  // Update asset in MongoDB when title/description changes
  const updateAssetMetadata = async (title: string, description: string) => {
    try {
      console.log('💾 Updating asset metadata:', { assetId: asset.id, name: title, description });
      const result = await updateAsset({ assetId: asset.id, name: title, description });
      
      if (result.success) {
        console.log('✅ Asset metadata updated successfully');
        // Update local asset object to reflect changes
        asset.name = title;
        asset.description = description;
      } else {
        console.error('❌ Failed to update asset metadata:', result);
      }
    } catch (error) {
      console.error('❌ Failed to update asset metadata:', error);
    }
  };

  // Debounced update function to avoid too many API calls
  const debouncedUpdateAsset = useCallback(
    debounce((title: string, description: string) => {
      updateAssetMetadata(title, description);
    }, 1000),
    [asset.id]
  );

  // Trigger updates when metadata changes
  useEffect(() => {
    if (customMetadata.title !== asset.name || customMetadata.description !== (asset.description || '')) {
      debouncedUpdateAsset(customMetadata.title, customMetadata.description);
    }
  }, [customMetadata.title, customMetadata.description, asset.name, asset.description, debouncedUpdateAsset]);

  const removeAttribute = (index: number) => {
    setCustomMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const getStepProgress = () => {
    const steps = ['license', 'metadata', 'confirm', 'processing'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {['license', 'metadata', 'confirm'].map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = getStepProgress() > index;
          
          return (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isActive ? 'bg-[#6366F1] text-white' : 
                isCompleted ? 'bg-[#10B981] text-white' : 
                'bg-[#E5E7EB] text-[#6B7280]'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  isCompleted ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* IP Registration Status Indicator */}
      {registration && (
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          registration.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          registration.status === 'FAILED' ? 'bg-red-100 text-red-800' :
          ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(registration.status) ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {registration.status === 'COMPLETED' ? '✅ IP Protected' :
           registration.status === 'FAILED' ? '❌ Registration Failed' :
           ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(registration.status) ? '⏳ Registration In Progress' :
           '📝 Registration Draft'}
        </div>
      )}
    </div>
  );

  const renderLicenseStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#111827] mb-2">Choose Your License Terms</h3>
        <p className="text-[#6B7280]">Select how others can use your protected IP</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PIL_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedPIL === template.id
                ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-lg'
                : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md'
            }`}
            onClick={() => setSelectedPIL(template.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{template.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-[#111827] text-sm">{template.name}</h4>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPIL === template.id
                    ? 'border-[#6366F1] bg-[#6366F1]'
                    : 'border-[#D1D5DB]'
                }`}>
                  {selectedPIL === template.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
              <p className="text-[#6B7280] text-xs mb-3">{template.description}</p>
              <div className="space-y-1">
                {template.features.map((feature, index) => (
                  <div key={index} className="text-xs text-[#6B7280]">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep('metadata')}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Continue to Metadata
        </button>
      </div>
    </div>
  );

  const renderMetadataStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#111827] mb-2">Enhanced Metadata</h3>
        <p className="text-[#6B7280]">Add rich details to make your IP more discoverable</p>
      </div>

      {/* AI Image Analysis Status */}
      {asset.type === 'IMAGE' && asset.imageUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            {isAnalyzingImage ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700 font-medium">Analyzing image with Firebase AI...</span>
              </>
            ) : aiAnalysis ? (
              <>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-green-700 font-medium">
                    Firebase AI analysis complete • Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                  </span>
                  <div className="text-xs text-gray-600 mt-1">
                    <strong>Detected:</strong> {aiAnalysis.visualAttributes.visualType} • {aiAnalysis.visualAttributes.artGenre} • {aiAnalysis.visualAttributes.mood}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-700">Image analysis available</span>
                  <button
                    onClick={generateAIMetadata}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Analyze with Firebase AI
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Enhancement Section */}
      <div className="bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 rounded-xl p-6 border border-[#6366F1]/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-sm">
            🤖
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] mb-1">AI-Enhanced Metadata</h4>
            <p className="text-sm text-[#6B7280]">Let AI analyze your asset and generate rich metadata</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <textarea
            placeholder="Describe this asset's unique traits, powers, backstory, rarity, visual style, role in your storyworld, or any special characteristics that would make it valuable and discoverable..."
            className="w-full p-4 border border-[#E5E7EB] rounded-xl resize-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
            rows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          
          <button
            onClick={handleGenerateMetadata}
            disabled={!aiPrompt.trim() || isGeneratingMetadata}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
              aiPrompt.trim() && !isGeneratingMetadata
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-xl'
                : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            {isGeneratingMetadata ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Generating with AI...
              </div>
            ) : (
              '✨ Generate Enhanced Metadata'
            )}
          </button>
        </div>
      </div>

      {/* Manual Metadata Editing */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">Title</label>
          <input
            type="text"
            className="w-full p-3 border border-[#E5E7EB] rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
            value={customMetadata.title}
            onChange={(e) => setCustomMetadata(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">Description</label>
          <textarea
            className="w-full p-3 border border-[#E5E7EB] rounded-xl resize-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
            rows={3}
            value={customMetadata.description}
            onChange={(e) => setCustomMetadata(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-[#111827]">Custom Attributes</label>
            <button
              onClick={addCustomAttribute}
              className="text-sm text-[#6366F1] hover:text-[#5B5BD6] font-medium"
            >
              + Add Attribute
            </button>
          </div>
          
          <div className="space-y-3">
            {customMetadata.attributes.map((attr, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Trait type (e.g., Rarity)"
                  className="flex-1 p-3 border border-[#E5E7EB] rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
                  value={attr.trait_type}
                  onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g., Legendary)"
                  className="flex-1 p-3 border border-[#E5E7EB] rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-colors"
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                />
                <button
                  onClick={() => removeAttribute(index)}
                  className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('license')}
          className="px-6 py-3 text-[#6B7280] hover:text-[#111827] font-medium transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep('confirm')}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Review & Confirm
        </button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#111827] mb-2">Review & Confirm Registration</h3>
        <p className="text-[#6B7280]">Double-check everything before registering your IP</p>
      </div>

      {/* Asset Preview */}
      <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
        <h4 className="font-medium text-[#111827] mb-4">Asset Preview</h4>
        <div className="flex items-start gap-4">
          {asset.type === 'IMAGE' && asset.imageUrl ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={asset.imageUrl} 
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-[#6366F1] rounded-xl flex items-center justify-center text-white text-3xl flex-shrink-0">
              {asset.type === 'CHARACTER' ? '👤' : 
               asset.type === 'STORYLINE' ? '📖' : 
               asset.type === 'LORE' ? '📜' : 
               asset.type === 'IMAGE' ? '🖼️' : '📄'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-[#111827] text-lg mb-1">{customMetadata.title}</h5>
            <p className="text-sm text-[#6B7280] mb-2">{asset.type}</p>
            <p className="text-sm text-[#6B7280] line-clamp-3">{customMetadata.description}</p>
          </div>
        </div>
      </div>

      {/* Registration Summary */}
      <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] space-y-4">

        <div>
          <h4 className="font-medium text-[#111827] mb-2">License Terms</h4>
          <div className="text-sm text-[#6B7280]">
            <p>{PIL_TEMPLATES.find(t => t.id === selectedPIL)?.name}</p>
          </div>
        </div>

        {customMetadata.attributes.length > 0 && (
          <div>
            <h4 className="font-medium text-[#111827] mb-2">Custom Attributes</h4>
            <div className="text-sm text-[#6B7280] space-y-1">
              {customMetadata.attributes.map((attr, index) => (
                <p key={index}><strong>{attr.trait_type}:</strong> {attr.value}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {registration?.lastError && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-[#EF4444] mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-[#EF4444] mb-1">Registration Failed</h4>
              <p className="text-sm text-[#7F1D1D]">{registration.lastError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Information */}
      <div className="bg-gradient-to-r from-[#10B981]/5 to-[#059669]/5 rounded-xl p-6 border border-[#10B981]/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center text-white text-sm">
            💰
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] mb-2">Registration Cost</h4>
            <div className="text-sm text-[#6B7280] space-y-1">
              <p className="flex justify-between"><span>Story Protocol Registration:</span> <span className="line-through">~$2.50</span></p>
              <p className="flex justify-between"><span>Gas Fees:</span> <span className="line-through">~$1.20</span></p>
              <p className="flex justify-between font-medium text-[#10B981]"><span>Your Cost (Sponsored):</span> <span>FREE</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('metadata')}
          className="px-6 py-3 text-[#6B7280] hover:text-[#111827] font-medium transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleStartRegistration}
          disabled={isProcessing}
          className={`px-8 py-3 font-medium rounded-xl transition-all duration-200 ${
            isProcessing
              ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#0F766E] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Starting Registration...
            </div>
          ) : (
            '🛡️ Register IP Asset (FREE)'
          )}
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => {
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'PENDING': return '⏳';
        case 'GENERATING_METADATA': return '🤖';
        case 'UPLOADING_METADATA': return '☁️';
        case 'REGISTERING_IP': return '🛡️';
        case 'COMPLETED': return '✅';
        case 'FAILED': return '❌';
        default: return '⏳';
      }
    };

    const getStatusMessage = (status: string) => {
      switch (status) {
        case 'PENDING': return 'Preparing registration...';
        case 'GENERATING_METADATA': return 'AI is enhancing your metadata...';
        case 'UPLOADING_METADATA': return 'Uploading metadata to IPFS...';
        case 'REGISTERING_IP': return 'Registering on Story Protocol blockchain...';
        case 'COMPLETED': return 'Registration completed successfully!';
        case 'FAILED': return 'Registration failed. Please try again.';
        default: return 'Processing...';
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
            {registration ? getStatusIcon(registration.status) : '⏳'}
          </div>
          <h3 className="text-xl font-semibold text-[#111827] mb-2">
            {registration ? getStatusMessage(registration.status) : 'Processing Registration...'}
          </h3>
          <p className="text-[#6B7280]">This may take a few moments. Please don't close this window.</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {[
            { status: 'PENDING', label: 'Registration Submitted', description: 'Your request has been received' },
            { status: 'GENERATING_METADATA', label: 'Enhancing Metadata', description: 'AI is analyzing and enriching your asset data' },
            { status: 'UPLOADING_METADATA', label: 'Uploading to IPFS', description: 'Storing metadata on decentralized storage' },
            { status: 'REGISTERING_IP', label: 'Blockchain Registration', description: 'Creating your IP record on Story Protocol' }
          ].map((step, index) => {
            const isActive = registration?.status === step.status;
            const isCompleted = registration && ['GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP', 'COMPLETED'].includes(registration.status) && 
                               ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA'].includes(step.status) && 
                               ['GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP', 'COMPLETED'].indexOf(registration.status) > 
                               ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].indexOf(step.status);

            return (
              <div key={step.status} className={`flex items-center gap-4 p-4 rounded-xl border ${
                isActive ? 'border-[#6366F1] bg-[#6366F1]/5' : 
                isCompleted ? 'border-[#10B981] bg-[#10B981]/5' : 
                'border-[#E5E7EB] bg-[#F9FAFB]'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  isActive ? 'bg-[#6366F1]' : 
                  isCompleted ? 'bg-[#10B981]' : 
                  'bg-[#D1D5DB]'
                }`}>
                  {isCompleted ? '✓' : isActive ? 
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 
                    index + 1
                  }
                </div>
                <div>
                  <h4 className={`font-medium ${
                    isActive ? 'text-[#6366F1]' : 
                    isCompleted ? 'text-[#10B981]' : 
                    'text-[#6B7280]'
                  }`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-[#6B7280]">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status History */}
        {registration?.statusHistory && registration.statusHistory.length > 0 && (
          <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
            <h4 className="font-medium text-[#111827] mb-3">Registration Log</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {registration.statusHistory.map((entry, index) => (
                <div key={index} className="text-sm text-[#6B7280] flex justify-between">
                  <span>{entry.message || entry.status}</span>
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={checkRegistrationStatus}
            className="px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Check Status
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
        🎉
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-[#111827] mb-4">IP Asset Protected!</h3>
        <p className="text-[#6B7280] mb-6">Your asset is now protected on Story Protocol</p>
      </div>

      {registration && (
        <div className="bg-[#F0FDF4] rounded-xl p-6 border border-[#BBF7D0] space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[#065F46]">IP ID:</span>
              <p className="text-[#047857] font-mono break-all">{registration.ipId || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium text-[#065F46]">License:</span>
              <p className="text-[#047857] font-mono break-all">{registration.pilTemplate}</p>
            </div>
          </div>
          
          {registration.txHash && (
            <a
              href={`https://aeneid.storyscan.io/tx/${registration.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#047857] hover:text-[#065F46] font-medium"
            >
              View on Story Protocol Explorer
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => onSuccess(registration)}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BD6] hover:to-[#7C3AED] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Continue to Library
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 text-[#6B7280] hover:text-[#111827] font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'license': return renderLicenseStep();
      case 'metadata': return renderMetadataStep();
      case 'confirm': return renderConfirmStep();
      case 'processing': return renderProcessingStep();
      case 'success': return renderSuccessStep();
      default: return renderLicenseStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">
            {registration?.status === 'COMPLETED' ? 'IP Asset Protected' : 
             registration && ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(registration.status) ? 'IP Registration In Progress' :
             `Protect "${asset.name}" with Story Protocol`}
          </h2>
          <p className="text-[#6B7280] mt-1">
            {registration?.status === 'COMPLETED' ? 'Your asset is now protected on the blockchain' :
             registration && ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(registration.status) ? 'Your registration is being processed' :
             'Secure your intellectual property on the blockchain'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {renderStepIndicator()}
      
      {/* Show different content based on registration status */}
      {registration?.status === 'COMPLETED' ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#111827] mb-4">IP Asset Protected!</h3>
          <p className="text-[#6B7280] mb-6">Your asset is now protected on Story Protocol</p>
        </div>
      ) : registration && ['PENDING', 'GENERATING_METADATA', 'UPLOADING_METADATA', 'REGISTERING_IP'].includes(registration.status) ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-[#111827] mb-4">Registration In Progress</h3>
          <p className="text-[#6B7280] mb-6">Your IP registration is being processed on the blockchain</p>
          <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6">
            <div className="text-sm">
              <span className="font-medium text-[#374151]">Current Status:</span>
              <p className="text-[#6B7280] mt-1">{registration.statusHistory?.[registration.statusHistory.length - 1]?.message || registration.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-[#6B7280] text-white px-6 py-3 rounded-lg hover:bg-[#5B5BD6] transition-colors"
          >
            Close
          </button>
        </div>
      ) : registration?.status === 'FAILED' ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#111827] mb-4">Registration Failed</h3>
          <p className="text-[#6B7280] mb-6">There was an issue with your IP registration</p>
          <div className="bg-[#FEF2F2] rounded-lg p-4 mb-6">
            <div className="text-sm">
              <span className="font-medium text-[#374151]">Error:</span>
              <p className="text-red-600 mt-1">{registration.lastError || 'Unknown error'}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                // Reset to allow retry
                setRegistration(null);
                setCurrentStep('license');
              }}
              className="bg-[#6366F1] text-white px-6 py-3 rounded-lg hover:bg-[#5B5BD6] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="bg-[#6B7280] text-white px-6 py-3 rounded-lg hover:bg-[#5B5BD6] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        renderCurrentStep()
      )}
    </div>
  );
}; 