import React from 'react';
import { 
  Chip, 
  Button, 
  Box, 
  Typography, 
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Clock,
  AlertCircle
} from 'lucide-react';

export interface StoryProtocolData {
  ipId?: string;
  tokenId?: string;
  txHash?: string;
  pilTemplate?: string;
  registrationDate?: Date;
  status?: 'registered' | 'pending' | 'failed';
  licenseTerms?: {
    commercial: boolean;
    derivatives: boolean;
    attribution: boolean;
    royaltyPercentage: number;
  };
}

interface IPStatusBadgeProps {
  storyProtocol?: StoryProtocolData;
  onRegister?: () => void;
  onViewDetails?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

const IPStatusBadge: React.FC<IPStatusBadgeProps> = ({
  storyProtocol,
  onRegister,
  onViewDetails,
  size = 'md',
  showActions = true
}) => {
  const isRegistered = storyProtocol?.status === 'registered' && storyProtocol?.ipId;
  const isPending = storyProtocol?.status === 'pending';
  const hasFailed = storyProtocol?.status === 'failed';

  const getBadgeContent = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
    
    if (isRegistered) {
      return {
        icon: <ShieldCheck size={iconSize} />,
        text: 'IP Protected',
        color: 'success' as const,
        sx: { backgroundColor: '#dcfce7', color: '#166534' }
      };
    }
    
    if (isPending) {
      return {
        icon: <Clock size={iconSize} />,
        text: 'Registration Pending',
        color: 'warning' as const,
        sx: { backgroundColor: '#fef3c7', color: '#92400e' }
      };
    }
    
    if (hasFailed) {
      return {
        icon: <ShieldAlert size={iconSize} />,
        text: 'Registration Failed',
        color: 'error' as const,
        sx: { backgroundColor: '#fee2e2', color: '#dc2626' }
      };
    }
    
    return {
      icon: <Shield size={iconSize} />,
      text: 'Not Protected',
      color: 'default' as const,
      sx: { backgroundColor: '#f9fafb', color: '#6b7280' }
    };
  };

  const badgeContent = getBadgeContent();

  const formatLicenseInfo = () => {
    if (!storyProtocol?.licenseTerms) return null;
    
    const { commercial, derivatives, attribution, royaltyPercentage } = storyProtocol.licenseTerms;
    const features = [];
    
    if (commercial) features.push('Commercial');
    if (derivatives) features.push('Derivatives');
    if (attribution) features.push('Attribution');
    if (royaltyPercentage > 0) features.push(`${royaltyPercentage}% Royalty`);
    
    return features.join(' • ');
  };

  const handleViewOnExplorer = () => {
    if (storyProtocol?.ipId) {
      window.open(`https://explorer.story.foundation/ip/${storyProtocol.ipId}`, '_blank');
    }
  };

  if (size === 'sm') {
    return (
      <Chip 
        icon={badgeContent.icon}
        label={badgeContent.text}
        size="small"
        sx={badgeContent.sx}
      />
    );
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip 
          icon={badgeContent.icon}
          label={badgeContent.text}
          size={size === 'lg' ? 'medium' : 'small'}
          sx={badgeContent.sx}
        />
        
        {isRegistered && storyProtocol?.pilTemplate && (
          <Chip 
            label={storyProtocol.pilTemplate}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {isRegistered && storyProtocol && (
        <Box>
          {size === 'lg' && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                IP ID: <Box component="code" sx={{ bgcolor: 'grey.100', px: 0.5, borderRadius: 0.5, fontSize: '0.75rem' }}>
                  {storyProtocol.ipId?.slice(0, 8)}...{storyProtocol.ipId?.slice(-6)}
                </Box>
              </Typography>
              
              {formatLicenseInfo() && (
                <Typography variant="caption" color="text.primary">
                  {formatLicenseInfo()}
                </Typography>
              )}
              
              {storyProtocol.registrationDate && (
                <Typography variant="caption" color="text.secondary">
                  Registered: {storyProtocol.registrationDate.toLocaleDateString()}
                </Typography>
              )}
            </Stack>
          )}
          
          {showActions && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
              {onViewDetails && (
                <Button
                  variant="text"
                  size="small"
                  onClick={onViewDetails}
                  sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                >
                  Details
                </Button>
              )}
              
              <Button
                variant="text"
                size="small"
                onClick={handleViewOnExplorer}
                startIcon={<ExternalLink size={12} />}
                sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
              >
                Explorer
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {!isRegistered && !isPending && showActions && onRegister && (
        <Button
          variant="outlined"
          size="small"
          onClick={onRegister}
          startIcon={<Shield size={14} />}
          sx={{ 
            fontSize: '0.75rem',
            height: size === 'lg' ? 32 : 28
          }}
        >
          Register as IP
        </Button>
      )}

      {hasFailed && showActions && onRegister && (
        <Button
          variant="outlined"
          size="small"
          onClick={onRegister}
          startIcon={<AlertCircle size={14} />}
          color="error"
          sx={{ 
            fontSize: '0.75rem',
            height: size === 'lg' ? 32 : 28
          }}
        >
          Retry Registration
        </Button>
      )}

      {isPending && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Clock size={12} style={{ animation: 'pulse 2s infinite' }} />
          <Typography variant="caption" color="text.secondary">
            Processing registration...
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default IPStatusBadge; 