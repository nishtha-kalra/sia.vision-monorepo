import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Alert,
  IconButton,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Shield, 
  AutoAwesome, 
  CheckCircle, 
  ContentCopy,
  Close,
  Add,
  Delete
} from '@mui/icons-material';
import { useStoryProtocol } from '@/hooks/useStoryProtocol';

interface Asset {
  id: string;
  name: string;
  type: string;
  mediaUrl?: string;
  createdAt: Date;
}

interface IPRegistrationDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSuccess?: (result: any) => void;
}

interface GeneratedMetadata {
  title: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string }>;
  suggestedPIL: string;
  pilReasoning: string;
  confidence: number;
}

const PIL_TEMPLATES = [
  { id: 'non-commercial-social-remixing', name: 'Non-Commercial Social Remixing', description: 'Free to use for non-commercial purposes with attribution' },
  { id: 'creative-commons-attribution', name: 'Creative Commons Attribution', description: 'Open license similar to CC-BY' },
  { id: 'commercial-remix', name: 'Commercial Remix', description: 'Commercial use with derivatives allowed, 5% revenue share' },
  { id: 'commercial-use', name: 'Commercial Use', description: 'Commercial use allowed without derivatives' }
];

const IPRegistrationDialog: React.FC<IPRegistrationDialogProps> = ({
  open,
  onClose,
  asset,
  onSuccess
}) => {
  const [step, setStep] = useState(0);
  const [generatingMetadata, setGeneratingMetadata] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [selectedPIL, setSelectedPIL] = useState('LT-COMM-5');
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [userContext, setUserContext] = useState('');
  
  // Generated metadata
  const [generatedMetadata, setGeneratedMetadata] = useState<GeneratedMetadata | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  
  const { registerAsIP, generateMetadata, loading, error } = useStoryProtocol({
    onSuccess: (result) => {
      setRegistrationResult(result);
      setStep(2);
      onSuccess?.(result);
    }
  });

  // Reset form when dialog opens/closes or asset changes
  useEffect(() => {
    if (open && asset) {
      setTitle(asset.name);
      setDescription(`Professional digital asset: ${asset.name}`);
      setCreatorName('');
      setSelectedPIL('commercial-remix');
      setAttributes([]);
      setAiPrompt('Generate professional IP metadata for licensing and commercial use');
      setUserContext('');
      setGeneratedMetadata(null);
      setRegistrationResult(null);
      setStep(0);
    }
  }, [open, asset]);

  const handleGenerateMetadata = async () => {
    if (!asset) return;

    try {
      setGeneratingMetadata(true);
      
      const metadata = await generateMetadata({
        assetId: asset.id,
        prompt: aiPrompt,
        context: userContext
      });

      setGeneratedMetadata(metadata);
      
      // Auto-fill form with generated data
      setTitle(metadata.title);
      setDescription(metadata.description);
      setAttributes(metadata.attributes);
      setSelectedPIL(metadata.suggestedPIL);
      
      setStep(1); // Move to review step
    } catch (error) {
      console.error('Error generating metadata:', error);
    } finally {
      setGeneratingMetadata(false);
    }
  };

  const handleRegisterAsIP = async () => {
    if (!asset) return;

    // Validate required fields
    if (!title.trim() || !description.trim() || !creatorName.trim()) {
      return;
    }

    const customMetadata = {
      title: title.trim(),
      description: description.trim(),
      creatorName: creatorName.trim(),
      attributes
    };

    await registerAsIP({
      assetId: asset.id,
      pilTemplate: selectedPIL,
      customMetadata
    });
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Metadata Input
        return (
          <Box sx={{ mt: 2 }}>
            {/* AI Generation Section */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                avatar={<AutoAwesome color="primary" />}
                title="AI-Powered Metadata Generation"
                subheader="Let AI help you create compelling metadata for your IP asset"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="What should we know about this asset?"
                    multiline
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., This is a character design for a fantasy story..."
                  />
                  <TextField
                    fullWidth
                    label="Additional Context"
                    multiline
                    rows={3}
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    placeholder="e.g., Part of a larger universe, intended for merchandising..."
                  />
                </Box>
                
                <Button 
                  onClick={handleGenerateMetadata} 
                  disabled={generatingMetadata}
                  variant="contained"
                  startIcon={generatingMetadata ? <CircularProgress size={20} /> : <AutoAwesome />}
                  sx={{ mt: 2, width: '100%' }}
                >
                  {generatingMetadata ? 'Generating Metadata...' : 'Generate Metadata with AI'}
                </Button>

                {generatedMetadata && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>AI Generated:</strong> {generatedMetadata.pilReasoning}
                    </Typography>
                    <Chip 
                      label={`${Math.round(generatedMetadata.confidence * 100)}% Confidence`} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Manual Input Section */}
            <Typography variant="h6" gutterBottom>Asset Metadata</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter asset title"
                  required
                />
                <TextField
                  fullWidth
                  label="Creator Name *"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Enter creator name"
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your asset and its potential uses"
                required
              />

              <FormControl fullWidth>
                <InputLabel>License Template</InputLabel>
                <Select
                  value={selectedPIL}
                  onChange={(e) => setSelectedPIL(e.target.value)}
                  label="License Template"
                >
                  {PIL_TEMPLATES.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Attributes Section */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">Attributes</Typography>
                  <Button variant="outlined" size="small" onClick={addAttribute} startIcon={<Add />}>
                    Add Attribute
                  </Button>
                </Stack>
                
                {attributes.map((attr, index) => (
                  <Stack key={index} direction="row" spacing={2} sx={{ mb: 1 }}>
                    <TextField
                      placeholder="Trait type"
                      value={attr.trait_type}
                      onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                      size="small"
                    />
                    <TextField
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeAttribute(index)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 1: // Review
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Review Registration Details</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please review all details before registering your IP asset
            </Typography>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                      <Typography variant="body2">{title}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Creator</Typography>
                      <Typography variant="body2">{creatorName}</Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body2">{description}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">License Template</Typography>
                    <Chip label={selectedPIL} size="small" />
                  </Box>

                  {attributes.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Attributes</Typography>
                      <Box sx={{ mt: 1 }}>
                        {attributes.map((attr, index) => (
                          <Typography key={index} variant="body2">
                            <strong>{attr.trait_type}:</strong> {attr.value}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 2: // Success
        return (
          <Box sx={{ mt: 2 }}>
            {registrationResult && (
              <Card>
                <CardHeader
                  avatar={<CheckCircle color="success" />}
                  title="IP Registration Successful!"
                  subheader="Your asset has been successfully registered on Story Protocol"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">IP Asset ID</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontFamily="monospace">
                          {registrationResult.ipId}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(registrationResult.ipId)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Transaction Hash</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontFamily="monospace">
                          {registrationResult.txHash}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(registrationResult.txHash)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Box>

                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your IP asset is now protected by Story Protocol and can be licensed to others.
                    You can view it on the Story Protocol explorer or manage licensing through the SIA platform.
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return 'Asset Metadata';
      case 1: return 'Review Details';
      case 2: return 'Registration Complete';
      default: return 'Register IP Asset';
    }
  };

  const canProceed = () => {
    if (step === 0) {
      return title.trim() && description.trim() && creatorName.trim();
    }
    return true;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Shield />
            <Typography variant="h6">{getStepTitle()}</Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Register "{asset?.name}" as an IP asset on Story Protocol with programmable licensing.
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {step > 0 && step < 2 && (
          <Button onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        
        {step === 0 && (
          <Button 
            onClick={() => setStep(1)} 
            disabled={!canProceed()}
            variant="contained"
          >
            Next: Review
          </Button>
        )}
        
        {step === 1 && (
          <Button 
            onClick={handleRegisterAsIP} 
            disabled={loading || !canProceed()}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Shield />}
          >
            {loading ? 'Registering...' : 'Register IP Asset'}
          </Button>
        )}
        
        {step === 2 && (
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IPRegistrationDialog; 