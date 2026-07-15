/**
 * JWordenAI™ - Jarvis Brain V1.0
 * Logic: Southern Gentleman / Porsche Performance
 */

type JarvisTrigger = 'SHOW_3D_VIEWER' | 'SHOW_SLIDESHOW' | 'NONE';

interface JarvisResponse {
  message: string;
  trigger: JarvisTrigger;
  category?: string;
}

export const jarvisLogic = {
  getInitialGreeting: (): string => {
    return "Good day. I am Jarvis, the Worden Digital Foreman. Mr. George is currently overseeing our premium fleet, but I am authorized to walk you through our Gold Standard. Are we discussing a commercial asset or a private estate today?";
  },

  processResponse: (input: string): JarvisResponse => {
    const text = input.toLowerCase();

    if (text.includes('commercial') || text.includes('business') || text.includes('reit')) {
      return {
        message: "Understood. For commercial assets, we deploy the Sunday Protocol™—zero downtime, maximum ROI. Would you like to see the 3D integrity of our base-layer compaction?",
        trigger: "SHOW_3D_VIEWER",
        category: "Commercial",
      };
    }

    if (text.includes('driveway') || text.includes('residential') || text.includes('house')) {
      return {
        message: "Excellent. A private estate deserves the Worden Console-Edged finish. It's the aesthetic benchmark of Richmond. Shall we open the gallery of our masonry-edged driveways?",
        trigger: "SHOW_SLIDESHOW",
        category: "Residential",
      };
    }

    return {
      message: "I want to ensure we provide the exact engineering your property requires. Could you tell me if this project is for a business or a private home?",
      trigger: "NONE",
    };
  },
};
