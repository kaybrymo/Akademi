export type SFUProvider = 'livekit' | 'agora' | 'custom';

export interface SFUConfig {
  provider: SFUProvider;
  serverUrl: string;
  autoSwitchThreshold: number; // default: 8
  enableEcoMobileMode: boolean;
  apiKey?: string;
  apiSecret?: string;
}

export interface VideoResolutionPreset {
  id: '1080p' | '720p' | '480p' | '360p_eco';
  label: string;
  width: number;
  height: number;
  frameRate: number;
  maxBitrateKbps: number;
  description: string;
}

export const VIDEO_PRESETS: VideoResolutionPreset[] = [
  {
    id: '1080p',
    label: '1080p Full HD (2.5 Mbps)',
    width: 1920,
    height: 1080,
    frameRate: 30,
    maxBitrateKbps: 2500,
    description: 'High-bandwidth fiber/WiFi connection. Maximum clarity for equations & diagrams.'
  },
  {
    id: '720p',
    label: '720p HD Standard (1.2 Mbps)',
    width: 1280,
    height: 720,
    frameRate: 30,
    maxBitrateKbps: 1200,
    description: 'Balanced HD streaming for laptops and stable broadband.'
  },
  {
    id: '480p',
    label: '480p SD (600 Kbps)',
    width: 854,
    height: 480,
    frameRate: 24,
    maxBitrateKbps: 600,
    description: 'Standard mobile data saver for cellular networks.'
  },
  {
    id: '360p_eco',
    label: '🌿 360p Eco SFU Mode (300 Kbps)',
    width: 640,
    height: 360,
    frameRate: 20,
    maxBitrateKbps: 300,
    description: 'Ultra low-bandwidth optimization for 3G/4G mobile devices with SFU packet relay.'
  }
];

export interface SFUNetworkStats {
  mode: 'Mesh P2P (1-on-1)' | 'LiveKit SFU Cloud Relay' | 'Agora SFU Media Server';
  serverRegion: string;
  pingMs: number;
  packetLossPercent: number;
  currentBitrateKbps: number;
  activePreset: VideoResolutionPreset;
  connectedPeersCount: number;
  isEcoActive: boolean;
}

export const getSavedSFUConfig = (): SFUConfig => {
  try {
    const saved = localStorage.getItem('akademi_sfu_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    provider: 'livekit',
    serverUrl: 'wss://sfu-lagos.akademi.dev',
    autoSwitchThreshold: 8,
    enableEcoMobileMode: true,
    apiKey: 'AKADEMI_LIVEKIT_KEY_2026',
    apiSecret: 'AKADEMI_LIVEKIT_SECRET_SECURE'
  };
};

export const saveSFUConfig = (config: SFUConfig) => {
  localStorage.setItem('akademi_sfu_config', JSON.stringify(config));
  window.dispatchEvent(new Event('storage'));
};

export interface MasterclassParticipant {
  id: string;
  name: string;
  role: 'tutor' | 'student' | 'ta';
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  signalStrength: 'excellent' | 'good' | 'poor';
}

export const generateMasterclassPeers = (count: number): MasterclassParticipant[] => {
  const seedPeers: MasterclassParticipant[] = [
    { id: 'peer-1', name: 'Dr. Chiamaka Eze', role: 'tutor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', isMuted: false, isVideoOff: false, isSpeaking: true, signalStrength: 'excellent' },
    { id: 'peer-2', name: 'Chiamaka Ada (You)', role: 'student', avatar: '/images/hero-student.jpg', isMuted: false, isVideoOff: false, isSpeaking: false, signalStrength: 'excellent' },
    { id: 'peer-3', name: 'Daniel Okafor', role: 'ta', avatar: '/images/tutor-daniel.jpg', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-4', name: 'Amina Bello', role: 'student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-5', name: 'Yusuf Ibrahim', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: true, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-6', name: 'Emeka Nnaji', role: 'student', avatar: '/images/tutor-ibrahim.jpg', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'excellent' },
    { id: 'peer-7', name: 'Adaeze Nwosu', role: 'ta', avatar: '/images/tutor-adaeze.jpg', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-8', name: 'Ngozi Uche', role: 'student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-9', name: 'Segun Adeyemi', role: 'student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-10', name: 'Fatima Sanusi', role: 'student', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'poor' },
    { id: 'peer-11', name: 'Kelechi Egwu', role: 'student', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: true, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-12', name: 'Blessing Okon', role: 'student', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'excellent' },
    { id: 'peer-13', name: 'Tunde Bakare', role: 'student', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-14', name: 'Chiamaka Nnamdi', role: 'student', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-15', name: 'Oluwaseun Ojo', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' },
    { id: 'peer-16', name: 'Zainab Danjuma', role: 'student', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', isMuted: true, isVideoOff: false, isSpeaking: false, signalStrength: 'good' }
  ];

  return seedPeers.slice(0, count);
};
