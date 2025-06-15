import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Info, 
  AttachMoney, 
  People, 
  Security, 
  FlashOn 
} from '@mui/icons-material';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface PILTemplate {
  id: string;
  name: string;
  description: string;
  mintingFee: string;
  currency: string;
  features: string[];
}

interface PILTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  disabled?: boolean;
}

const PILTemplateSelector: React.FC<PILTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  disabled = false
}) => {
  const [templates, setTemplates] = useState<PILTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!functions) {
        throw new Error('Firebase Functions not initialized');
      }
      const getPILTemplates = httpsCallable(functions, 'getPILTemplates');
      const result = await getPILTemplates({});
      const data = result.data as any;
      
      if (data.success) {
        setTemplates(data.templates);
      } else {
        setError('Failed to load PIL templates');
      }
    } catch (err) {
      console.error('Error loading PIL templates:', err);
      setError('Failed to load PIL templates');
    } finally {
      setLoading(false);
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'non-commercial-social-remixing':
        return <People sx={{ color: 'success.main' }} />;
      case 'creative-commons-attribution':
        return <Security sx={{ color: 'info.main' }} />;
      case 'commercial-remix':
        return <AttachMoney sx={{ color: 'secondary.main' }} />;
      case 'commercial-use':
        return <FlashOn sx={{ color: 'warning.main' }} />;
      default:
        return <Info sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTemplateChipColor = (templateId: string): 'success' | 'info' | 'secondary' | 'warning' | 'default' => {
    switch (templateId) {
      case 'non-commercial-social-remixing':
        return 'success';
      case 'creative-commons-attribution':
        return 'info';
      case 'commercial-remix':
        return 'secondary';
      case 'commercial-use':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatMintingFee = (fee: string) => {
    if (fee === '0') return 'Free';
    const ethValue = parseFloat(fee) / 1e18;
    return `${ethValue} ETH`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="Loading PIL Templates..." />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="PIL Templates" />
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={loadTemplates}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        avatar={<Security />}
        title="Choose License Template"
        subheader="Select how others can use your IP asset. Each template defines different rights and revenue sharing."
      />
      <CardContent>
        <RadioGroup 
          value={selectedTemplate} 
          onChange={(e) => onTemplateChange(e.target.value)}
        >
          {templates.map((template) => (
            <Box key={template.id} sx={{ mb: 2 }}>
              <FormControlLabel
                value={template.id}
                control={<Radio disabled={disabled} />}
                label={
                  <Card 
                    variant="outlined"
                    sx={{ 
                      width: '100%',
                      cursor: disabled ? 'default' : 'pointer',
                      border: selectedTemplate === template.id ? 2 : 1,
                      borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: disabled ? 'divider' : 'primary.light'
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={2} flex={1}>
                          {getTemplateIcon(template.id)}
                          <Box>
                            <Typography variant="h6" component="h3">
                              {template.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {template.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={formatMintingFee(template.mintingFee)}
                          color={getTemplateChipColor(template.id)}
                          size="small"
                        />
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {template.features.map((feature, index) => (
                          <Box key={index} display="flex" alignItems="center" gap={1}>
                            <Box 
                              sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main' 
                              }} 
                            />
                            <Typography variant="body2">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                }
                sx={{ 
                  m: 0, 
                  width: '100%',
                  '& .MuiFormControlLabel-label': { 
                    width: '100%' 
                  }
                }}
              />
            </Box>
          ))}
        </RadioGroup>

        {selectedTemplate && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Selected:</strong> {templates.find(t => t.id === selectedTemplate)?.name}
              <br />
              This license will be permanently attached to your IP asset on Story Protocol.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PILTemplateSelector; 