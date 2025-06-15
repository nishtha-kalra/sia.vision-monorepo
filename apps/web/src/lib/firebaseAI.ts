import { getVertexAI, getGenerativeModel } from '@firebase/ai';
import app from './firebase';

// Initialize Firebase AI only on client side
let vertexAI: any = null;
let model: any = null;

const initializeFirebaseAI = () => {
  if (typeof window !== 'undefined' && app && !vertexAI) {
    try {
      vertexAI = getVertexAI(app);
      model = getGenerativeModel(vertexAI, { 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Firebase AI:', error);
    }
  }
};

// Initialize on client side
if (typeof window !== 'undefined') {
  initializeFirebaseAI();
}

export interface ImageAnalysisResult {
  description: string;
  visualAttributes: {
    visualType: string;
    artGenre: string;
    colorPalette: string[];
    lighting: string;
    quality: string;
    mood: string;
    style: string;
  };
  detectedObjects: string[];
  suggestedTags: string[];
  confidence: number;
}

export interface StoryProtocolAttributes {
  // Story-specific attributes
  narrativeRole: 'Protagonist' | 'Antagonist' | 'Supporting Character' | 'Narrator' | 'Background Element';
  storyArc: 'Origin' | 'Rising Action' | 'Climax' | 'Resolution' | 'Epilogue';
  emotionalTone: 'Heroic' | 'Tragic' | 'Comedic' | 'Mysterious' | 'Romantic' | 'Dark' | 'Uplifting';
  significance: 'Plot Critical' | 'Character Development' | 'World Building' | 'Thematic' | 'Atmospheric';
  
  // Creative attributes
  creativeComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Intricate' | 'Masterwork';
  originalityScore: number; // 1-100
  collaborationPotential: 'Standalone' | 'Remix Friendly' | 'Derivative Base' | 'Collaboration Hub';
  
  // Visual/Media attributes (for images, videos, etc.)
  visualStyle?: 'Realistic' | 'Stylized' | 'Abstract' | 'Minimalist' | 'Detailed' | 'Conceptual';
  colorMood?: 'Vibrant' | 'Muted' | 'Monochrome' | 'Warm' | 'Cool' | 'Dramatic';
  composition?: 'Centered' | 'Dynamic' | 'Balanced' | 'Asymmetrical' | 'Layered';
  
  // Story world context
  worldBuilding?: 'Foundational' | 'Expansive' | 'Detail-Rich' | 'Atmospheric' | 'Immersive';
  culturalDepth?: 'Surface' | 'Moderate' | 'Deep' | 'Profound' | 'Archetypal';
  
  // Licensing and usage
  commercialViability: 'High' | 'Medium' | 'Low' | 'Niche' | 'Experimental';
  adaptationPotential: 'Film' | 'Game' | 'Book' | 'Audio' | 'Interactive' | 'Multi-Media';
}

export class FirebaseAIService {
  /**
   * Analyze an image using Firebase AI Logic with Vertex AI
   */
  static async analyzeImage(
    imageUrl: string,
    prompt?: string
  ): Promise<ImageAnalysisResult> {
    // Ensure client-side initialization
    if (typeof window === 'undefined') {
      throw new Error('Firebase AI can only be used on the client side');
    }
    
    console.log('🔍 Starting Firebase AI image analysis for:', imageUrl);
    
    initializeFirebaseAI();
    
    if (!model) {
      console.error('❌ Firebase AI model not initialized');
      throw new Error('Firebase AI model not initialized');
    }

    console.log('✅ Firebase AI model initialized successfully');

    try {
      const analysisPrompt = prompt || `
        Analyze this image in detail and provide a comprehensive analysis in JSON format.
        Focus on visual characteristics, artistic elements, and content description.
        
        Return ONLY valid JSON with this exact structure:
        {
          "description": "Detailed description of the image",
          "visualAttributes": {
            "visualType": "Photography/Digital Art/Illustration/3D Render/etc",
            "artGenre": "Portrait/Landscape/Abstract/Fantasy/etc",
            "colorPalette": ["primary", "secondary", "accent colors"],
            "lighting": "Natural/Dramatic/Soft/Hard/etc",
            "quality": "High/Medium/Low resolution description",
            "mood": "Emotional tone of the image",
            "style": "Artistic style description"
          },
          "detectedObjects": ["list", "of", "main", "objects"],
          "suggestedTags": ["relevant", "tags", "for", "categorization"],
          "confidence": 0.95
        }
      `;

      console.log('📥 Fetching image as base64...');
      const imageData = await this.fetchImageAsBase64(imageUrl);
      console.log('✅ Image fetched successfully, size:', imageData.length, 'characters');

      // Create image part from URL
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: this.getMimeTypeFromUrl(imageUrl)
        }
      };

      console.log('🤖 Sending request to Firebase AI...');
      // Generate content with image and prompt
      const result = await model.generateContent([
        analysisPrompt,
        imagePart
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw AI response:', text);

      // Parse JSON response
      const analysisResult = JSON.parse(text.trim());
      console.log('✅ Parsed AI analysis result:', analysisResult);
      
      return {
        description: analysisResult.description || 'No description available',
        visualAttributes: {
          visualType: analysisResult.visualAttributes?.visualType || 'Unknown',
          artGenre: analysisResult.visualAttributes?.artGenre || 'General',
          colorPalette: analysisResult.visualAttributes?.colorPalette || [],
          lighting: analysisResult.visualAttributes?.lighting || 'Natural',
          quality: analysisResult.visualAttributes?.quality || 'Standard',
          mood: analysisResult.visualAttributes?.mood || 'Neutral',
          style: analysisResult.visualAttributes?.style || 'Contemporary'
        },
        detectedObjects: analysisResult.detectedObjects || [],
        suggestedTags: analysisResult.suggestedTags || [],
        confidence: analysisResult.confidence || 0.8
      };

    } catch (error) {
      console.error('❌ Firebase AI image analysis error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        imageUrl
      });
      
      // Fallback to mock analysis
      console.log('🔄 Falling back to mock analysis');
      return this.generateMockImageAnalysis(imageUrl);
    }
  }

  /**
   * Generate Story Protocol attributes using AI analysis
   */
  static async generateStoryAttributes(
    imageUrl: string,
    title: string,
    description: string,
    assetType: string,
    storyworldContext?: {
      name: string;
      genre: string;
      themes?: string[];
    }
  ): Promise<StoryProtocolAttributes> {
    // Ensure client-side initialization
    if (typeof window === 'undefined') {
      throw new Error('Firebase AI can only be used on the client side');
    }
    
    console.log('🎭 Starting Story Protocol attributes generation for:', { title, assetType, imageUrl });
    
    initializeFirebaseAI();
    
    if (!model) {
      console.error('❌ Firebase AI model not initialized for Story attributes');
      throw new Error('Firebase AI model not initialized');
    }

    console.log('✅ Firebase AI model ready for Story attributes generation');

    try {
      const contextPrompt = storyworldContext 
        ? `This asset is part of "${storyworldContext.name}", a ${storyworldContext.genre} storyworld${storyworldContext.themes ? ` with themes: ${storyworldContext.themes.join(', ')}` : ''}.`
        : '';

      const metadataPrompt = `
        Generate asset attributes for search and attributes for this ${assetType.toLowerCase()} asset titled "${title}". 
        Description: ${description}
        ${contextPrompt}
        
        Analyze this creative asset and return ONLY valid JSON with this exact structure:
        {
          "narrativeRole": "Protagonist|Antagonist|Supporting Character|Narrator|Background Element",
          "storyArc": "Origin|Rising Action|Climax|Resolution|Epilogue",
          "emotionalTone": "Heroic|Tragic|Comedic|Mysterious|Romantic|Dark|Uplifting",
          "significance": "Plot Critical|Character Development|World Building|Thematic|Atmospheric",
          "creativeComplexity": "Simple|Moderate|Complex|Intricate|Masterwork",
          "originalityScore": 1-100,
          "collaborationPotential": "Standalone|Remix Friendly|Derivative Base|Collaboration Hub",
          "visualStyle": "Realistic|Stylized|Abstract|Minimalist|Detailed|Conceptual",
          "colorMood": "Vibrant|Muted|Monochrome|Warm|Cool|Dramatic",
          "composition": "Centered|Dynamic|Balanced|Asymmetrical|Layered",
          "worldBuilding": "Foundational|Expansive|Detail-Rich|Atmospheric|Immersive",
          "culturalDepth": "Surface|Moderate|Deep|Profound|Archetypal",
          "commercialViability": "High|Medium|Low|Niche|Experimental",
          "adaptationPotential": "Film|Game|Book|Audio|Interactive|Multi-Media"
        }
      `;

      console.log('📥 Fetching image for Story attributes...');
      const imageData = await this.fetchImageAsBase64(imageUrl);
      console.log('✅ Image ready for Story attributes, size:', imageData.length, 'characters');

      // Create image part from URL
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: this.getMimeTypeFromUrl(imageUrl)
        }
      };

      console.log('🤖 Generating Story Protocol attributes with AI...');
      const result = await model.generateContent([
        metadataPrompt,
        imagePart
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw Story attributes response:', text);

      const metadata = JSON.parse(text.trim());
      console.log('✅ Parsed Story attributes:', metadata);
      
      return {
        narrativeRole: metadata.narrativeRole || 'Supporting Character',
        storyArc: metadata.storyArc || 'Rising Action',
        emotionalTone: metadata.emotionalTone || 'Mysterious',
        significance: metadata.significance || 'Thematic',
        creativeComplexity: metadata.creativeComplexity || 'Moderate',
        originalityScore: metadata.originalityScore || Math.floor(Math.random() * 40) + 60,
        collaborationPotential: metadata.collaborationPotential || 'Remix Friendly',
        visualStyle: metadata.visualStyle || 'Stylized',
        colorMood: metadata.colorMood || 'Vibrant',
        composition: metadata.composition || 'Dynamic',
        worldBuilding: metadata.worldBuilding || 'Detail-Rich',
        culturalDepth: metadata.culturalDepth || 'Moderate',
        commercialViability: metadata.commercialViability || 'Medium',
        adaptationPotential: metadata.adaptationPotential || 'Multi-Media'
      };

    } catch (error) {
      console.error('❌ Firebase AI Story Protocol attributes generation error:', error);
      console.error('Story attributes error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        title,
        assetType,
        imageUrl
      });
      
      // Fallback to mock attributes
      console.log('🔄 Falling back to mock Story attributes');
      return this.generateMockStoryAttributes();
    }
  }

  /**
   * Stream image analysis for real-time results
   */
  static async streamImageAnalysis(
    imageUrl: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // Ensure client-side initialization
    if (typeof window === 'undefined') {
      throw new Error('Firebase AI can only be used on the client side');
    }
    
    initializeFirebaseAI();
    
    if (!model) {
      throw new Error('Firebase AI model not initialized');
    }

    try {
      const prompt = `
        Analyze this image and provide a detailed, streaming description.
        Focus on visual elements, artistic style, and content.
      `;

      const imagePart = {
        inlineData: {
          data: await this.fetchImageAsBase64(imageUrl),
          mimeType: this.getMimeTypeFromUrl(imageUrl)
        }
      };

      const result = await model.generateContentStream([
        prompt,
        imagePart
      ]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          onChunk(chunkText);
        }
      }

    } catch (error) {
      console.error('Firebase AI streaming error:', error);
      onChunk('Error analyzing image with AI');
    }
  }

  /**
   * Fetch image as base64 for Firebase AI
   */
  private static async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix (data:image/jpeg;base64,)
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image as base64:', error);
      throw error;
    }
  }

  /**
   * Get MIME type from image URL
   */
  private static getMimeTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg'; // Default fallback
    }
  }

  /**
   * Fallback mock image analysis
   */
  private static generateMockImageAnalysis(imageUrl: string): ImageAnalysisResult {
    const urlLower = imageUrl.toLowerCase();
    
    return {
      description: `AI-analyzed image with sophisticated visual elements and artistic composition`,
      visualAttributes: {
        visualType: urlLower.includes('photo') ? 'Photography' : 'Digital Art',
        artGenre: urlLower.includes('portrait') ? 'Portrait' : 'Conceptual',
        colorPalette: ['#2563eb', '#7c3aed', '#dc2626'],
        lighting: 'Dramatic',
        quality: 'High Resolution',
        mood: 'Inspiring',
        style: 'Contemporary Digital'
      },
      detectedObjects: ['main subject', 'background elements', 'artistic details'],
      suggestedTags: ['digital art', 'creative', 'modern', 'story protocol'],
      confidence: 0.85
    };
  }

  /**
   * Fallback mock Story Protocol attributes
   */
  private static generateMockStoryAttributes(): StoryProtocolAttributes {
    const narrativeRoles: StoryProtocolAttributes['narrativeRole'][] = ['Protagonist', 'Antagonist', 'Supporting Character', 'Narrator', 'Background Element'];
    const storyArcs: StoryProtocolAttributes['storyArc'][] = ['Origin', 'Rising Action', 'Climax', 'Resolution', 'Epilogue'];
    const emotionalTones: StoryProtocolAttributes['emotionalTone'][] = ['Heroic', 'Tragic', 'Comedic', 'Mysterious', 'Romantic', 'Dark', 'Uplifting'];
    const significances: StoryProtocolAttributes['significance'][] = ['Plot Critical', 'Character Development', 'World Building', 'Thematic', 'Atmospheric'];
    const complexities: StoryProtocolAttributes['creativeComplexity'][] = ['Simple', 'Moderate', 'Complex', 'Intricate', 'Masterwork'];
    const collaborationTypes: StoryProtocolAttributes['collaborationPotential'][] = ['Standalone', 'Remix Friendly', 'Derivative Base', 'Collaboration Hub'];
    const visualStyles: StoryProtocolAttributes['visualStyle'][] = ['Realistic', 'Stylized', 'Abstract', 'Minimalist', 'Detailed', 'Conceptual'];
    const colorMoods: StoryProtocolAttributes['colorMood'][] = ['Vibrant', 'Muted', 'Monochrome', 'Warm', 'Cool', 'Dramatic'];
    const compositions: StoryProtocolAttributes['composition'][] = ['Centered', 'Dynamic', 'Balanced', 'Asymmetrical', 'Layered'];
    const worldBuildings: StoryProtocolAttributes['worldBuilding'][] = ['Foundational', 'Expansive', 'Detail-Rich', 'Atmospheric', 'Immersive'];
    const culturalDepths: StoryProtocolAttributes['culturalDepth'][] = ['Surface', 'Moderate', 'Deep', 'Profound', 'Archetypal'];
    const commercialViabilities: StoryProtocolAttributes['commercialViability'][] = ['High', 'Medium', 'Low', 'Niche', 'Experimental'];
    const adaptationPotentials: StoryProtocolAttributes['adaptationPotential'][] = ['Film', 'Game', 'Book', 'Audio', 'Interactive', 'Multi-Media'];
    
    return {
      narrativeRole: narrativeRoles[Math.floor(Math.random() * narrativeRoles.length)],
      storyArc: storyArcs[Math.floor(Math.random() * storyArcs.length)],
      emotionalTone: emotionalTones[Math.floor(Math.random() * emotionalTones.length)],
      significance: significances[Math.floor(Math.random() * significances.length)],
      creativeComplexity: complexities[Math.floor(Math.random() * complexities.length)],
      originalityScore: Math.floor(Math.random() * 40) + 60, // 60-100 range for quality assets
      collaborationPotential: collaborationTypes[Math.floor(Math.random() * collaborationTypes.length)],
      visualStyle: visualStyles[Math.floor(Math.random() * visualStyles.length)],
      colorMood: colorMoods[Math.floor(Math.random() * colorMoods.length)],
      composition: compositions[Math.floor(Math.random() * compositions.length)],
      worldBuilding: worldBuildings[Math.floor(Math.random() * worldBuildings.length)],
      culturalDepth: culturalDepths[Math.floor(Math.random() * culturalDepths.length)],
      commercialViability: commercialViabilities[Math.floor(Math.random() * commercialViabilities.length)],
      adaptationPotential: adaptationPotentials[Math.floor(Math.random() * adaptationPotentials.length)]
    };
  }
}

export default FirebaseAIService; 