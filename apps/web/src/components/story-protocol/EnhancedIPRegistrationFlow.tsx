"use client";
import React, { useState, useEffect } from 'react';
import { Asset, Storyworld } from '@/types';
import { useUser } from '@/hooks/useUser';
import { useStoryProtocol } from '@/hooks/useStoryProtocol';

// PIL Templates - simplified version for this component
const PIL_TEMPLATES = {
  NON_COMMERCIAL_SOCIAL_REMIXING: {
    id: 'non-commercial-social-remixing',
    name: 'Non-Commercial Social Remixing',
    description: 'Free to use for non-commercial purposes with attribution',
    mintingFee: '0',
    currency: 'ETH',
    features: [
      '✅ Remix this work (derivatives allowed)',
      '✅ Distribute their remix anywhere',
      '✅ Get the license for free (no minting fee)',
      '❌ Commercialize the original and derivative works'
    ]
  },
  COMMERCIAL_USE: {
    id: 'commercial-use',
    name: 'Commercial Use',
    description: 'Commercial use allowed without derivatives',
    mintingFee: '0.001',
    currency: 'ETH',
    features: [
      '✅ Commercial use allowed',
      '✅ Generate revenue from the work',
      '❌ Create derivative works',
      '✅ Attribution required'
    ]
  },
  COMMERCIAL_REMIX: {
    id: 'commercial-remix',
    name: 'Commercial Remix',
    description: 'Commercial use with derivatives allowed, 10% revenue share',
    mintingFee: '0.002',
    currency: 'ETH',
    features: [
      '✅ Commercial use allowed',
      '✅ Create derivative works',
      '✅ 10% revenue sharing',
      '✅ Attribution required'
    ]
  },
  CREATIVE_COMMONS: {
    id: 'creative-commons-attribution',
    name: 'Creative Commons Attribution',
    description: 'Open license similar to CC-BY',
    mintingFee: '0',
    currency: 'ETH',
    features: [
      '✅ Free to use and remix',
      '✅ Commercial use allowed',
      '✅ Attribution required',
      '✅ Share derivatives under same license'
    ]
  }
};

interface EnhancedIPRegistrationFlowProps {
  asset: Asset;
  storyworld: Storyworld;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: any) => void;
}

interface IPFormData {
  title: string;
  description: string;
  creatorName: string;
  walletAddress: string;
  selectedPIL: string;
  attributes: Array<{ trait_type: string; value: string }>;
  useAIGeneration: boolean;
  customPrompt: string;
}

const EnhancedIPRegistrationFlow: React.FC<EnhancedIPRegistrationFlowProps> = ({
  asset,
  storyworld,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { authUser, profile } = useUser();
  const { registerAsIP, generateMetadata, loading, error } = useStoryProtocol({
    onSuccess: (result) => {
      setStep(5); // Move to success step
      onSuccess(result);
    }
  });

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<IPFormData>({
    title: asset.name,
    description: asset.description || '',
    creatorName: '',
    walletAddress: '',
    selectedPIL: 'non-commercial-social-remixing',
    attributes: [],
    useAIGeneration: true,
    customPrompt: ''
  });
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { title: 'Asset Details', description: 'Review and enhance asset information' },
    { title: 'Creator Info', description: 'Verify your creator details and wallet' },
    { title: 'License Terms', description: 'Choose your IP licensing terms' },
    { title: 'AI Enhancement', description: 'Generate enhanced metadata with AI' },
    { title: 'Review & Register', description: 'Confirm and register your IP' },
    { title: 'Success', description: 'IP registration complete' }
  ];

  // Initialize form data with user profile information
  useEffect(() => {
    if (authUser && profile) {
      setFormData(prev => ({
        ...prev,
        creatorName: profile.displayName || authUser.displayName || authUser.email?.split('@')[0] || '',
        walletAddress: profile.wallets?.ethereum || '', // Story Protocol uses Ethereum addresses
        description: asset.description || `A ${asset.type.toLowerCase()} asset from the "${storyworld.name}" storyworld.`
      }));
    }
  }, [authUser, profile, asset, storyworld]);

  // Generate AI-enhanced metadata
  const handleGenerateMetadata = async () => {
    if (!asset || !storyworld) return;

    setIsGenerating(true);
    try {
      const metadata = await generateMetadata({
        assetId: asset.id,
        prompt: formData.customPrompt || `Generate professional IP metadata for this ${asset.type.toLowerCase()} asset in the ${storyworld.name} storyworld. Focus on commercial licensing potential and creative value.`,
        context: `Asset: ${formData.title}\nType: ${asset.type}\nStoryworld: ${storyworld.name}\nDescription: ${storyworld.description}\nGenre: ${storyworld.genre || 'Not specified'}\nThemes: ${storyworld.themes?.join(', ') || 'Not specified'}`
      });

      setGeneratedMetadata(metadata);
      
      // Auto-fill form with generated data
      setFormData(prev => ({
        ...prev,
        title: metadata.title || prev.title,
        description: metadata.description || prev.description,
        attributes: metadata.attributes || prev.attributes,
        selectedPIL: metadata.suggestedPIL || prev.selectedPIL
      }));

    } catch (error) {
      console.error('Failed to generate metadata:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!asset) return;

    const customMetadata = {
      title: formData.title,
      description: formData.description,
      creatorName: formData.creatorName,
      attributes: formData.attributes
    };

    await registerAsIP({
      assetId: asset.id,
      pilTemplate: formData.selectedPIL,
      customMetadata
    });
  };

  // Update form field
  const updateFormData = (field: keyof IPFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add attribute
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  // Update attribute
  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  // Validate current step
  const canProceedToNextStep = () => {
    switch (step) {
      case 0:
        return formData.title.trim() && formData.description.trim();
      case 1:
        return formData.creatorName.trim() && formData.walletAddress.trim();
      case 2:
        return formData.selectedPIL;
      case 3:
        return true; // AI step is optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">🛡️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Register IP Asset</h2>
              <p className="text-[#6B7280]">Protect "{asset.name}" with Story Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((stepInfo, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= step 
                    ? 'bg-[#6366F1] text-white' 
                    : 'bg-[#E5E7EB] text-[#6B7280]'
                }`}>
                  {index < step ? '✓' : index + 1}
                </div>
                <div className="ml-2 mr-4">
                  <p className={`text-xs font-medium ${
                    index <= step ? 'text-[#111827]' : 'text-[#6B7280]'
                  }`}>
                    {stepInfo.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-2 ${
                    index < step ? 'bg-[#6366F1]' : 'bg-[#E5E7EB]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {/* Step 0: Asset Details */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">Asset Information</h3>
                <p className="text-[#6B7280]">Review and enhance your asset details for IP registration</p>
              </div>

              {/* Asset Preview */}
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-[#F3F4F6] rounded-lg overflow-hidden">
                      {asset.mediaUrl ? (
                        asset.type === 'VIDEO' ? (
                          <video
                            src={asset.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        ) : asset.type === 'IMAGE' ? (
                          <img
                            src={asset.mediaUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🎵
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-[#6B7280]">
                          📄
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Asset Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="Enter a compelling title for your IP asset..."
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Describe your asset's creative value, uniqueness, and potential uses..."
                        rows={4}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Storyworld Context */}
              <div className="bg-[#F0F4FF] rounded-xl p-4 border border-[#C7D2FE]">
                <h4 className="font-medium text-[#1E1B4B] mb-2">📚 Storyworld Context</h4>
                <div className="text-sm text-[#4C1D95] space-y-1">
                  <p><strong>World:</strong> {storyworld.name}</p>
                  <p><strong>Description:</strong> {storyworld.description}</p>
                  {storyworld.genre && <p><strong>Genre:</strong> {storyworld.genre}</p>}
                  {storyworld.themes && storyworld.themes.length > 0 && (
                    <p><strong>Themes:</strong> {storyworld.themes.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Creator Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">Creator Information</h3>
                <p className="text-[#6B7280]">Verify your identity and wallet for IP ownership</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Creator Name *
                  </label>
                  <input
                    type="text"
                    value={formData.creatorName}
                    onChange={(e) => updateFormData('creatorName', e.target.value)}
                    placeholder="Your name or artist name..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Wallet Address (Story Protocol) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => updateFormData('walletAddress', e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent font-mono text-sm"
                    />
                    {profile?.wallets?.ethereum && (
                      <button
                        onClick={() => updateFormData('walletAddress', profile.wallets?.ethereum || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-[#6366F1] text-white px-2 py-1 rounded"
                      >
                        Use Profile Wallet
                      </button>
                    )}
                  </div>
                  {!profile?.wallets?.ethereum && (
                    <p className="text-xs text-[#F59E0B] mt-1">
                      ⚠️ No wallet found in profile. Please verify your phone number to create wallets.
                    </p>
                  )}
                </div>

                {/* User Profile Info */}
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E5E7EB]">
                  <h4 className="font-medium text-[#111827] mb-3">👤 Profile Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Email:</span>
                      <span className="ml-2 text-[#111827]">{authUser?.email}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Phone Verified:</span>
                      <span className="ml-2 text-[#111827]">
                        {profile?.phoneNumber?.isVerified ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Wallet Status:</span>
                      <span className="ml-2 text-[#111827]">
                        {profile?.walletsStatus === 'completed' ? '✅ Ready' : 
                         profile?.walletsStatus === 'creating' ? '⏳ Creating' : '❌ Not Created'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Member Since:</span>
                      <span className="ml-2 text-[#111827]">
                        {authUser?.metadata.creationTime ? 
                          new Date(authUser.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: License Terms */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">Choose License Terms</h3>
                <p className="text-[#6B7280]">Select how others can use your IP asset</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PIL_TEMPLATES).map(([key, template]) => (
                  <div
                    key={key}
                    onClick={() => updateFormData('selectedPIL', template.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.selectedPIL === template.id
                        ? 'border-[#6366F1] bg-[#6366F1]/5'
                        : 'border-[#E5E7EB] hover:border-[#6366F1]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-[#111827]">{template.name}</h4>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        formData.selectedPIL === template.id
                          ? 'border-[#6366F1] bg-[#6366F1]'
                          : 'border-[#E5E7EB]'
                      }`}>
                        {formData.selectedPIL === template.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#6B7280] mb-4">{template.description}</p>
                    
                    <div className="space-y-2">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-xs text-[#4C1D95]">
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#6B7280]">Minting Fee:</span>
                        <span className="font-medium text-[#111827]">{template.mintingFee} {template.currency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: AI Enhancement */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">AI-Enhanced Metadata</h3>
                <p className="text-[#6B7280]">Let AI generate professional IP metadata using your storyworld context</p>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-6 border border-[#C7D2FE]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1E1B4B]">AI Metadata Generation</h4>
                    <p className="text-sm text-[#4C1D95]">Uses storyworld context and asset details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-2">
                      <input
                        type="checkbox"
                        checked={formData.useAIGeneration}
                        onChange={(e) => updateFormData('useAIGeneration', e.target.checked)}
                        className="rounded border-[#E5E7EB] text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      Use AI to enhance metadata
                    </label>
                  </div>

                  {formData.useAIGeneration && (
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Custom AI Prompt (Optional)
                      </label>
                      <textarea
                        value={formData.customPrompt}
                        onChange={(e) => updateFormData('customPrompt', e.target.value)}
                        placeholder="Provide specific instructions for AI metadata generation..."
                        rows={3}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleGenerateMetadata}
                    disabled={!formData.useAIGeneration || isGenerating}
                    className="w-full px-4 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Generate Enhanced Metadata
                      </>
                    )}
                  </button>
                </div>
              </div>

              {generatedMetadata && (
                <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                  <h4 className="font-medium text-[#111827] mb-4">✨ AI-Generated Enhancements</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Enhanced Title:</span>
                      <p className="text-[#111827] mt-1">{generatedMetadata.title}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Enhanced Description:</span>
                      <p className="text-[#111827] mt-1">{generatedMetadata.description}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Suggested License:</span>
                      <p className="text-[#111827] mt-1">{generatedMetadata.suggestedPIL}</p>
                    </div>
                    {generatedMetadata.attributes && generatedMetadata.attributes.length > 0 && (
                      <div>
                        <span className="text-[#6B7280]">Generated Attributes:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {generatedMetadata.attributes.map((attr: any, index: number) => (
                            <span key={index} className="px-2 py-1 bg-[#6366F1] text-white text-xs rounded">
                              {attr.trait_type}: {attr.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Attributes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[#111827]">Custom Attributes</h4>
                  <button
                    onClick={addAttribute}
                    className="px-3 py-1 text-[#6366F1] hover:text-[#5B5BD6] border border-[#6366F1] rounded-lg hover:bg-[#6366F1]/5 transition-colors text-sm"
                  >
                    + Add Attribute
                  </button>
                </div>

                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                      placeholder="Attribute name..."
                      className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      placeholder="Value..."
                      className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => removeAttribute(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review & Register */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">Review & Register</h3>
                <p className="text-[#6B7280]">Confirm your IP registration details</p>
              </div>

              <div className="space-y-6">
                {/* Asset Summary */}
                <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                  <h4 className="font-medium text-[#111827] mb-4">📄 Asset Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Title:</span>
                      <p className="text-[#111827] mt-1">{formData.title}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Type:</span>
                      <p className="text-[#111827] mt-1">{asset.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[#6B7280]">Description:</span>
                      <p className="text-[#111827] mt-1">{formData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                  <h4 className="font-medium text-[#111827] mb-4">👤 Creator Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Creator:</span>
                      <p className="text-[#111827] mt-1">{formData.creatorName}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Wallet:</span>
                      <p className="text-[#111827] mt-1 font-mono text-xs">
                        {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* License Terms */}
                <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5E7EB]">
                  <h4 className="font-medium text-[#111827] mb-4">📜 License Terms</h4>
                  {(() => {
                    const selectedTemplate = Object.values(PIL_TEMPLATES).find(t => t.id === formData.selectedPIL);
                    return selectedTemplate ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-[#6B7280]">License:</span>
                          <p className="text-[#111827] mt-1">{selectedTemplate.name}</p>
                        </div>
                        <div>
                          <span className="text-[#6B7280]">Description:</span>
                          <p className="text-[#111827] mt-1 text-sm">{selectedTemplate.description}</p>
                        </div>
                        <div>
                          <span className="text-[#6B7280]">Minting Fee:</span>
                          <p className="text-[#111827] mt-1">{selectedTemplate.mintingFee} {selectedTemplate.currency}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Registration Fee */}
                <div className="bg-[#FEF3C7] rounded-xl p-4 border border-[#F59E0B]">
                  <div className="flex items-start gap-3">
                    <span className="text-[#F59E0B] text-lg">💰</span>
                    <div>
                      <h4 className="font-medium text-[#92400E]">Registration Fee</h4>
                      <p className="text-sm text-[#92400E] mt-1">
                        One-time fee of $2.50 covers blockchain gas costs and platform processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#111827] mb-2">IP Registration Complete!</h3>
              <p className="text-[#6B7280] mb-6">
                "{asset.name}" is now protected by Story Protocol
              </p>
              <div className="bg-[#F0F9FF] rounded-xl p-6 border border-[#0EA5E9] max-w-md mx-auto">
                <h4 className="font-medium text-[#0C4A6E] mb-2">What's Next?</h4>
                <ul className="text-sm text-[#0C4A6E] space-y-1 text-left">
                  <li>• Your IP is now discoverable on Story Protocol</li>
                  <li>• Others can license your work according to your terms</li>
                  <li>• You'll receive royalties from commercial uses</li>
                  <li>• Track usage and earnings in your dashboard</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 5 && (
          <div className="flex items-center justify-between p-6 border-t border-[#E5E7EB] bg-[#F8FAFC]">
            <button
              onClick={step === 0 ? onClose : () => setStep(step - 1)}
              className="px-4 py-2 text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            
            <button
              onClick={step === 4 ? handleRegister : () => setStep(step + 1)}
              disabled={!canProceedToNextStep() || loading}
              className="px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Registering...
                </>
              ) : step === 4 ? (
                <>
                  <span>🛡️</span>
                  Register IP Asset
                </>
              ) : (
                'Next'
              )}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedIPRegistrationFlow; 