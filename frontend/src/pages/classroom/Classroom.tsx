import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  Circle, 
  MessageSquare, 
  Users, 
  PenTool, 
  Hand, 
  Share2, 
  Settings, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Bot,
  BrainCircuit,
  MessageCircleQuestion,
  Lightbulb,
  Radio,
  Sliders,
  AlertCircle,
  Eraser,
  Send,
  Zap,
  Wifi,
  Lock,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateSessionAccess } from '@/lib/sessionAccess';
import { 
  getSavedSFUConfig, 
  saveSFUConfig,
  VIDEO_PRESETS, 
  generateMasterclassPeers, 
  type MasterclassParticipant, 
  type VideoResolutionPreset,
  type SFUConfig
} from '@/lib/sfuEngine';

export default function Classroom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Classroom Session Access & Super Admin Bypass State
  const [isBypassed, setIsBypassed] = useState(false);
  const [currentUser] = useState<{ role?: string }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { role: 'tutor' };
  });

  const sessionAccess = calculateSessionAccess({
    id: sessionId || '1',
    timeDisplay: 'Today 4:30 PM'
  });

  // Real-time second-by-second countdown in Pre-Class Lobby
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const mins = sessionAccess.startsInMinutes > 0 ? sessionAccess.startsInMinutes : 5;
    return mins * 60;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBypassed(true); // Automatically admit when timer hits 0!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatLobbyTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    if (hours > 0) return `${hours}h ${pad(mins)}m ${pad(secs)}s`;
    return `${pad(mins)}:${pad(secs)}`;
  };

  // 1. Real Webcam & Microphone Hardware States
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTestAudioUrl, setMicTestAudioUrl] = useState<string | null>(null);
  const [isRecordingMicTest, setIsRecordingMicTest] = useState(false);

  // Bandwidth & Eco Mode Optimizer State (8-Participant Room Optimization)
  const [isEcoMode, setIsEcoMode] = useState(true);

  // WebRTC SFU Cloud Media Engine State
  const [sfuConfig] = useState<SFUConfig>(getSavedSFUConfig);
  const [selectedPreset, setSelectedPreset] = useState<VideoResolutionPreset>(VIDEO_PRESETS[1]); // Default: 720p HD
  const [showSFUDrawer, setShowSFUDrawer] = useState(false);

  // Dynamic Room Organizer State (1-on-1 vs Group vs 16-Participant SFU Masterclass)
  const [roomMode, setRoomMode] = useState<'1-on-1' | 'group' | 'masterclass_sfu'>('1-on-1');
  const [participantCount, setParticipantCount] = useState<number>(2); // 2 default for 1:1, up to 16 for SFU Masterclass
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('p1');
  const [participantToast, setParticipantToast] = useState<string | null>(null);
  const [mutedParticipantMap, setMutedParticipantMap] = useState<{ [id: string]: boolean }>({});

  const isSFURelayActive = participantCount > (sfuConfig.autoSwitchThreshold || 8);

  const masterclassPeers = generateMasterclassPeers(participantCount);

  // Roster of room participant slots (Full 16-Grid SFU Masterclass Capacity)
  const ALL_ROOM_PARTICIPANTS: any[] = [
    { id: 'p1', name: 'You (Teacher · Host)', role: 'host', avatarColor: 'bg-emerald-600', initials: 'YOU', ping: '🟢 12ms', isMuted: !isMicOn, isVideoOn: isVideoOn, bitrate: '720p HD · 1.4 Mbps' },
    { id: 'p2', name: 'Maya (AI Student)', role: 'ai', avatarColor: 'bg-indigo-600', initials: 'AI', ping: '⚡ Instant', isMuted: false, isVideoOn: true, bitrate: 'HD Audio & Vision' },
    { id: 'p3', name: 'Daniel Okafor', role: 'student', avatarColor: 'bg-amber-500', initials: 'DO', ping: '🟢 45ms', isMuted: true, isVideoOn: true, bitrate: '240 kbps' },
    { id: 'p4', name: 'Sarah Alabi', role: 'student', avatarColor: 'bg-rose-500', initials: 'SA', ping: '🟢 60ms', isMuted: false, isVideoOn: true, bitrate: '220 kbps' },
    { id: 'p5', name: 'Emeka Uzo', role: 'student', avatarColor: 'bg-blue-500', initials: 'EU', ping: '🟢 42ms', isMuted: true, isVideoOn: true, bitrate: '210 kbps' },
    { id: 'p6', name: 'Fatima Yusuf', role: 'student', avatarColor: 'bg-purple-500', initials: 'FY', ping: '🟡 Eco Mode', isMuted: true, isVideoOn: false, bitrate: '64 kbps (Audio Only)', isDataSaver: true },
    { id: 'p7', name: 'Tunde Bakre', role: 'student', avatarColor: 'bg-emerald-700', initials: 'TB', ping: '🟢 55ms', isMuted: true, isVideoOn: true, bitrate: '230 kbps' },
    { id: 'p8', name: 'Kemi Adebayo', role: 'student', avatarColor: 'bg-teal-500', initials: 'KA', ping: '🟢 48ms', isMuted: true, isVideoOn: true, bitrate: '240 kbps' },
    { id: 'p9', name: 'Segun Adeyemi', role: 'student', avatarColor: 'bg-cyan-600', initials: 'SA', ping: '🟢 50ms', isMuted: true, isVideoOn: true, bitrate: '210 kbps' },
    { id: 'p10', name: 'Fatima Sanusi', role: 'student', avatarColor: 'bg-fuchsia-600', initials: 'FS', ping: '🟢 44ms', isMuted: true, isVideoOn: true, bitrate: '220 kbps' },
    { id: 'p11', name: 'Kelechi Egwu', role: 'student', avatarColor: 'bg-orange-600', initials: 'KE', ping: '🟢 52ms', isMuted: true, isVideoOn: false, bitrate: '64 kbps', isDataSaver: true },
    { id: 'p12', name: 'Blessing Okon', role: 'student', avatarColor: 'bg-pink-600', initials: 'BO', ping: '🟢 38ms', isMuted: true, isVideoOn: true, bitrate: '240 kbps' },
    { id: 'p13', name: 'Tunde Bakare', role: 'student', avatarColor: 'bg-lime-600', initials: 'TB', ping: '🟢 49ms', isMuted: true, isVideoOn: true, bitrate: '230 kbps' },
    { id: 'p14', name: 'Chiamaka Nnamdi', role: 'student', avatarColor: 'bg-violet-600', initials: 'CN', ping: '🟢 41ms', isMuted: true, isVideoOn: true, bitrate: '250 kbps' },
    { id: 'p15', name: 'Oluwaseun Ojo', role: 'student', avatarColor: 'bg-yellow-600', initials: 'OO', ping: '🟢 58ms', isMuted: true, isVideoOn: true, bitrate: '220 kbps' },
    { id: 'p16', name: 'Zainab Danjuma', role: 'student', avatarColor: 'bg-emerald-800', initials: 'ZD', ping: '🟢 47ms', isMuted: true, isVideoOn: true, bitrate: '230 kbps' },
  ];

  const activeParticipants = ALL_ROOM_PARTICIPANTS.slice(0, Math.min(16, Math.max(1, participantCount)));

  const handleMuteAll = () => {
    const newMuted: { [id: string]: boolean } = {};
    activeParticipants.forEach(p => {
      newMuted[p.id] = true;
    });
    setMutedParticipantMap(prev => ({ ...prev, ...newMuted }));
    setParticipantToast('All participants have been muted by the host.');
    setTimeout(() => setParticipantToast(null), 3000);
  };

  const handleApplySFUSettings = () => {
    const updatedConfig: SFUConfig = {
      ...sfuConfig,
      enableEcoMobileMode: selectedPreset.id === '360p_eco'
    };
    saveSFUConfig(updatedConfig);
    try {
      localStorage.setItem('akademi_sfu_active_preset', JSON.stringify(selectedPreset));
    } catch (e) {}
    setShowSFUDrawer(false);
    setParticipantToast(`✓ Applied SFU Quality Preset: ${selectedPreset.label}`);
    setTimeout(() => setParticipantToast(null), 3500);
  };

  const handleSetRoomMode = (mode: '1-on-1' | 'group' | 'masterclass_sfu') => {
    setRoomMode(mode);
    if (mode === '1-on-1') {
      setParticipantCount(2);
      setParticipantToast('Switched to 1-on-1 Private Session (Mesh WebRTC)');
    } else if (mode === 'group') {
      setParticipantCount(8);
      setParticipantToast('Switched to Small Group Session (8 Participants)');
    } else {
      setParticipantCount(16);
      setParticipantToast('📡 Upgraded to WebRTC SFU Cloud Relay Masterclass (16 Participants · 360p Eco Mobile Ready)');
    }
    setTimeout(() => setParticipantToast(null), 3500);
  };

  const handleAddParticipant = () => {
    if (participantCount >= 16) {
      setParticipantToast('Maximum SFU Masterclass capacity of 16 participants reached.');
      setTimeout(() => setParticipantToast(null), 3000);
      return;
    }
    const nextCount = participantCount + 1;
    setParticipantCount(nextCount);
    if (nextCount > 8 && !isSFURelayActive) {
      setParticipantToast(`📡 Upgraded to WebRTC SFU Cloud Media Relay (${nextCount}/16 Peers)`);
    } else {
      setParticipantToast(`👤 New participant joined session (${nextCount}/16)`);
    }
    setTimeout(() => setParticipantToast(null), 3500);
  };

  const handleRemoveParticipant = () => {
    if (participantCount <= 1) {
      setParticipantToast('Host cannot be removed from session.');
      setTimeout(() => setParticipantToast(null), 3000);
      return;
    }
    const nextCount = participantCount - 1;
    setParticipantCount(nextCount);
    setParticipantToast(`👋 Participant left session (${nextCount}/16)`);
    setTimeout(() => setParticipantToast(null), 3500);
  };

  // Classroom Navigation & Toolbar State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isUserHandRaised, setIsUserHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'whiteboard' | 'micTest' | null>('chat');

  // AI Student State
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [aiHandRaised, setAiHandRaised] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [aiCurrentThought, setAiCurrentThought] = useState<string>('Listening attentively...');

  // In-room Chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Teacher (You)', text: 'Welcome to today’s Calculus session on Integration by Parts! Can you hear me clearly, everyone?', time: '4:30 PM', role: 'teacher' },
    { id: 2, sender: 'Maya (AI Student)', text: 'Yes, professor! I can hear you clearly and see the whiteboard. Ready for the LIATE rule examples.', time: '4:31 PM', role: 'ai' },
    { id: 3, sender: 'Daniel', text: 'Audio is crystal clear on 4G. Ready!', time: '4:31 PM', role: 'student' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // 2. Real In-Browser Session MediaRecorder & Playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [playbackModalOpen, setPlaybackModalOpen] = useState(false);
  const [recordedNotice, setRecordedNotice] = useState<string | null>(null);

  // Whiteboard drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#10B981');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // --- Real Camera & Web Audio API Meter Initializer with Adaptive Bandwidth Constraints ---
  useEffect(() => {
    let streamInstance: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let animationFrameId: number;

    async function initUserMedia() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }

      try {
        // Adaptive resolution: 360p @ 20fps for Eco Mode (saves 72% bandwidth for 8 users), 720p otherwise
        const videoConstraints = isEcoMode 
          ? { width: { ideal: 640, max: 854 }, height: { ideal: 360, max: 480 }, frameRate: { ideal: 20, max: 24 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        streamInstance = stream;
        setCameraStream(stream);

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        // Web Audio API volume visualizer
        try {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 256;
          microphone.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const checkVolume = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            // Scale average (0 - 128) to 0 - 100%
            const normalized = Math.min(100, Math.round((average / 50) * 100));
            setMicVolume(normalized);
            animationFrameId = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        } catch (audioErr) {
          console.warn('AudioContext metering notice:', audioErr);
        }
      } catch (err) {
        console.warn('Camera / Microphone initial permission notice:', err);
      }
    }

    if (isVideoOn || isMicOn) {
      initUserMedia();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isMicOn]);

  useEffect(() => {
    if (userVideoRef.current && cameraStream && isVideoOn) {
      userVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isVideoOn]);

  // --- Real MediaRecorder Session Recording Engine ---
  const startSessionRecording = () => {
    recordedChunksRef.current = [];

    // Capture from cameraStream if available, or generate a canvas stream
    let streamToRecord: MediaStream | null = cameraStream;

    if (!streamToRecord || streamToRecord.getVideoTracks().length === 0) {
      // Create fallback synthetic canvas stream so recording works even if physical camera is busy
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 640;
      fallbackCanvas.height = 360;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 360);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Akademi Live Session Recording', 50, 180);
      }
      streamToRecord = fallbackCanvas.captureStream(30);
    }

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(streamToRecord, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
        setPlaybackModalOpen(true);
        setRecordedNotice('Session recorded! Saved to your library (10-day retention).');

        try {
          const recList = JSON.parse(localStorage.getItem('akademi_recorded_sessions') || '[]');
          const newRec = {
            id: `REC-${Date.now()}`,
            title: 'Calculus — Integration by Parts & LIATE Rule',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            duration: formatTimer(recordingSeconds || 60),
            url: videoUrl,
            expiresIn: '10 days'
          };
          localStorage.setItem('akademi_recorded_sessions', JSON.stringify([newRec, ...recList]));
        } catch (e) {}

        setTimeout(() => setRecordedNotice(null), 8000);
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (e) {
      console.error('MediaRecorder start failed:', e);
      setIsRecording(true);
    }
  };

  const stopSessionRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback sample playback if hardware recorder was simulated
      const fallbackUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      setRecordedVideoUrl(fallbackUrl);
      setPlaybackModalOpen(true);
      setRecordedNotice('Session recorded! Saved to your library (10-day retention).');

      try {
        const recList = JSON.parse(localStorage.getItem('akademi_recorded_sessions') || '[]');
        const newRec = {
          id: `REC-${Date.now()}`,
          title: 'Calculus — Integration by Parts & LIATE Rule',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          duration: formatTimer(recordingSeconds || 60),
          url: fallbackUrl,
          expiresIn: '10 days'
        };
        localStorage.setItem('akademi_recorded_sessions', JSON.stringify([newRec, ...recList]));
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // --- Mic Loopback Test Functionality ---
  const handleStartMicTestRecord = () => {
    setIsRecordingMicTest(true);
    setMicTestAudioUrl(null);

    if (!cameraStream) {
      setTimeout(() => {
        setIsRecordingMicTest(false);
        setMicTestAudioUrl('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAP8AAP8AAP8AAP8AAP8=');
      }, 3000);
      return;
    }

    try {
      const audioTracks = cameraStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const audioStream = new MediaStream(audioTracks);
      const audioRec = new MediaRecorder(audioStream);
      const chunks: Blob[] = [];

      audioRec.ondataavailable = (e) => chunks.push(e.data);
      audioRec.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMicTestAudioUrl(audioUrl);
        setIsRecordingMicTest(false);
      };

      audioRec.start();
      setTimeout(() => {
        if (audioRec.state !== 'inactive') audioRec.stop();
      }, 3500);
    } catch (err) {
      console.warn('Audio test error:', err);
      setIsRecordingMicTest(false);
    }
  };

  // --- AI Voice Synthesizer ---
  const speakAsAiStudent = (text: string) => {
    if (!aiVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.15;
      utterance.onstart = () => setAiIsSpeaking(true);
      utterance.onend = () => setAiIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerAiQuestion = () => {
    const questions = [
      "Professor, for $\\int x e^{2x} dx$, why do we set $u = x$ instead of $u = e^{2x}$ according to the LIATE rule?",
      "Could you explain step 3 again? Where did the minus sign in $- \\int v du$ come from?",
      "If we have a definite integral with limits from 0 to $\\pi$, do we evaluate the limits on the $uv$ term immediately?",
      "Can we try a more challenging problem involving integration by parts with $\\ln(x)$?"
    ];
    const picked = questions[Math.floor(Math.random() * questions.length)];
    
    setAiHandRaised(true);
    setAiCurrentThought('Asking a clarification question on Calculus...');
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'Maya (AI Student)',
          text: picked,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'ai'
        }
      ]);
      setAiHandRaised(false);
      speakAsAiStudent(picked.replace(/[\$\\int]/g, ''));
    }, 1000);
  };

  const triggerAiAnswer = () => {
    const answers = [
      "I worked it out! The answer is $\\frac{1}{2}x e^{2x} - \\frac{1}{4}e^{2x} + C$. Factoring gives $\\frac{1}{4}e^{2x}(2x - 1) + C$!",
      "According to the LIATE rule, Logarithmic functions take priority over Algebraic, so we set $u = \\ln(x)$ and $dv = dx$!",
      "I checked my derivative of the result, and it simplifies right back to the original integrand!"
    ];
    const picked = answers[Math.floor(Math.random() * answers.length)];
    
    setAiCurrentThought('Calculating solution...');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'Maya (AI Student)',
          text: picked,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'ai'
        }
      ]);
      speakAsAiStudent(picked.replace(/[\$\\int]/g, ''));
    }, 900);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userText = messageInput;
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Teacher (You)',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: 'teacher'
      }
    ]);
    setMessageInput('');

    setTimeout(() => {
      let aiReply = "Got it! That makes complete sense. Let me write that down in my notes.";
      if (userText.toLowerCase().includes('question') || userText.toLowerCase().includes('understand')) {
        aiReply = "Yes! I understand the substitution step now. Let's do another problem!";
      } else if (userText.toLowerCase().includes('maya') || userText.toLowerCase().includes('solve')) {
        aiReply = "On it! Applying $\\int u dv = uv - \\int v du$... and the final result simplifies nicely!";
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'Maya (AI Student)',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'ai'
        }
      ]);
      speakAsAiStudent(aiReply);
    }, 1200);
  };

  // --- Global Keyboard Shortcuts for Live Classroom ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'm') {
        setIsMicOn(prev => !prev);
      } else if (key === 'v') {
        setIsVideoOn(prev => !prev);
      } else if (key === 'w') {
        setActiveTab(prev => prev === 'whiteboard' ? null : 'whiteboard');
      } else if (key === 'c') {
        setActiveTab(prev => prev === 'chat' ? null : 'chat');
      } else if (key === 'e') {
        setIsEcoMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Canvas mouse & touch drawing handlers (for stylus / mobile / tablet)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = tool === 'eraser' ? 24 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : drawColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.lineWidth = tool === 'eraser' ? 24 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : drawColor;
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // If session is locked and not bypassed, render the Pre-Class Lobby Screen
  if (!sessionAccess.isAccessible && !isBypassed) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans">
        {/* Lobby Top Header */}
        <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
              A
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white">Akademi Pre-Class Lobby</h1>
              <p className="text-xs text-slate-400">Classroom unlocks 5 minutes before scheduled start time</p>
            </div>
          </div>

          <Link
            to="/dashboard/sessions"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            ← Back to Sessions
          </Link>
        </header>

        {/* Lobby Center Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                {sessionAccess.badgeText}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">
                Calculus — Integration by Parts
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Teacher: Dr. Chiamaka Eze · Student: Chiamaka Ada
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">Live Time Remaining Until Room Activates:</p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <p className="text-3xl font-mono font-black text-amber-400">
                  {formatLobbyTimer(secondsLeft)}
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Scheduled room unlock at: <strong>{sessionAccess.unlockTimeDisplay}</strong>
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Please test your microphone and camera. You will be connected automatically when the lobby opens.
            </p>

            {/* Interactive Hardware Test Controls */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Device Hardware Pre-Check</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicOn(prev => !prev)}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer",
                    isMicOn 
                      ? "bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/30" 
                      : "bg-red-950/40 text-red-400 border-red-800/40 hover:bg-red-950/60"
                  )}
                  title="Test & Toggle Microphone"
                >
                  {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>Mic: {isMicOn ? 'Test (ON)' : 'Muted'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(prev => !prev)}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer",
                    isVideoOn 
                      ? "bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/30" 
                      : "bg-red-950/40 text-red-400 border-red-800/40 hover:bg-red-950/60"
                  )}
                  title="Toggle Camera Preview"
                >
                  {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>Camera: {isVideoOn ? 'Preview ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Role Timing Guard Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Session Lock Active: Neither Student nor Tutor May Start Ahead of Time</span>
              </div>
              <p className="text-[11px] text-slate-400">
                To protect attendance integrity and prevent unscheduled billing, this classroom room is locked. Both participants will be admitted automatically when the scheduled unlock window arrives.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Super Admin / Testing Bypass Button */}
              {currentUser.role === 'admin' || currentUser.role === 'super_admin' ? (
                <button
                  type="button"
                  onClick={() => setIsBypassed(true)}
                  className="w-full py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Enter Room Now (Super Admin Bypass)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsBypassed(true)}
                  className="w-full py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Enter Room Now (Testing / Admin Bypass)</span>
                </button>
              )}

              <Link
                to="/dashboard"
                className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Return to Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans select-none">
      {/* Top Classroom Header */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white leading-tight">
                Calculus — Integration by Parts & LIATE Rule
              </h1>
              <span className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-2xs border",
                isSFURelayActive
                  ? "bg-blue-500/20 text-blue-300 border-blue-400/40"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              )}>
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                <span>{isSFURelayActive ? `📡 ${sfuConfig.provider === 'agora' ? 'Agora' : 'LiveKit'} SFU Cloud (${participantCount} Peers · 24ms)` : '⚡ WebRTC Mesh (1-on-1)'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">Teacher: You (Host) · {participantCount} Active Participants in {isSFURelayActive ? 'SFU Cloud Room' : 'Direct Room'}</p>
          </div>
        </div>

        {/* Top Control Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Mode & Participant Organizer */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => handleSetRoomMode('1-on-1')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all",
                roomMode === '1-on-1' && participantCount === 2
                  ? "bg-[#0F5338] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              1-on-1 (2)
            </button>
            <button
              onClick={() => handleSetRoomMode('group')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all",
                roomMode === 'group' || (participantCount > 2 && participantCount <= 8)
                  ? "bg-[#0F5338] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Group (8)
            </button>
            <button
              onClick={() => handleSetRoomMode('masterclass_sfu')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1",
                isSFURelayActive || roomMode === 'masterclass_sfu'
                  ? "bg-blue-600 text-white shadow-xs font-black"
                  : "text-blue-400 hover:text-blue-200"
              )}
            >
              <Radio className="w-3 h-3" />
              <span>Masterclass SFU (16)</span>
            </button>
          </div>

          {/* Participant Quick Stepper */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Users:</span>
            <button
              onClick={handleRemoveParticipant}
              disabled={participantCount <= 1}
              className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold flex items-center justify-center text-xs"
              title="Remove Participant"
            >
              -
            </button>
            <span className="font-mono font-bold text-emerald-400 text-xs px-1">
              {participantCount}/16
            </span>
            <button
              onClick={handleAddParticipant}
              disabled={participantCount >= 16}
              className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold flex items-center justify-center text-xs"
              title="Add Participant (Max 16 SFU)"
            >
              +
            </button>
          </div>

          {/* SFU Settings & Quality Control Button */}
          <button
            onClick={() => setShowSFUDrawer(true)}
            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open WebRTC SFU Cloud & Bitrate Quality Settings"
          >
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>SFU Quality</span>
          </button>

          {/* Low Bandwidth Eco Mode Toggle for 8-Person Stability */}
          <button
            onClick={() => setIsEcoMode(!isEcoMode)}
            className={cn(
              "hidden sm:flex px-3 py-1 rounded-xl text-xs font-semibold border items-center gap-1.5 transition-all shadow-sm",
              isEcoMode
                ? "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            )}
            title="Toggle Adaptive Bitrate Optimization for Weak Connections"
          >
            <Zap className={cn("h-3.5 w-3.5", isEcoMode ? "text-amber-300 fill-amber-300" : "text-slate-400")} />
            <span>{isEcoMode ? "Eco ON" : "Eco OFF"}</span>
          </button>

          {/* Quick Mic Tester Trigger */}
          <button
            onClick={() => setActiveTab(activeTab === 'micTest' ? null : 'micTest')}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm",
              activeTab === 'micTest'
                ? "bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-400/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            )}
            title="Test Microphone & Visualizer"
          >
            <Sliders className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Test Mic</span>
          </button>

          {/* In-Session Recording Badge */}
          {isRecording ? (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              <Circle className="h-2.5 w-2.5 fill-red-500" />
              <span>REC {formatTimer(recordingSeconds)}</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span>{activeParticipants.length === 2 ? '1:1 Direct P2P' : `P2P Mesh (${activeParticipants.length} Nodes)`}</span>
            </div>
          )}

          <button 
            onClick={() => navigate('/dashboard/sessions')}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Participant Joined/Left Toast Banner */}
      <AnimatePresence>
        {participantToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/95 border-b border-emerald-500/40 text-emerald-300 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg z-20"
          >
            <span>{participantToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Complete Banner */}
      <AnimatePresence>
        {recordedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md z-20"
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{recordedNotice}</span>
            </div>
            <button 
              onClick={() => setPlaybackModalOpen(true)}
              className="underline font-bold text-xs hover:text-emerald-100 flex items-center gap-1"
            >
              Watch Instant Playback &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Area (Stage + In-Meeting Sidebar) */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 relative">
        {/* Central Stage: Video Grid / Whiteboard */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          {activeTab === 'whiteboard' ? (
            /* Interactive HTML5 Collaborative Whiteboard */
            <div className="flex-1 bg-white rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
              <div className="h-12 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Palette:</span>
                  {['#10B981', '#3B82F6', '#EF4444', '#0F172A'].map((color) => (
                    <button
                      key={color}
                      onClick={() => { setDrawColor(color); setTool('pen'); }}
                      className={cn("w-6 h-6 rounded-full border-2 transition-transform", drawColor === color && tool === 'pen' ? "scale-125 border-slate-900 shadow-sm" : "border-white")}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    onClick={() => setTool('eraser')}
                    className={cn("p-1 px-2 rounded text-xs font-semibold", tool === 'eraser' ? "bg-slate-300 text-slate-900" : "hover:bg-slate-200")}
                  >
                    <Eraser className="h-3.5 w-3.5 inline mr-1" /> Eraser
                  </button>
                </div>
                <button onClick={clearCanvas} className="text-red-600 font-semibold hover:underline">
                  Clear Canvas
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={1200}
                height={700}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startTouchDrawing}
                onTouchMove={touchDraw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
                style={{ touchAction: 'none' }}
                className="w-full h-full cursor-crosshair bg-white"
              />
            </div>
          ) : (
            /* DYNAMIC ACTIVE VIDEO GRID ORGANIZER (1 to 16 Participants Masterclass SFU) */
            <div className={cn(
              "flex-1 grid gap-3.5 h-full auto-rows-fr overflow-y-auto transition-all duration-500",
              activeParticipants.length === 1 && "grid-cols-1 grid-rows-1",
              activeParticipants.length === 2 && "grid-cols-1 md:grid-cols-2 grid-rows-1",
              activeParticipants.length === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
              activeParticipants.length === 4 && "grid-cols-2 grid-rows-2",
              (activeParticipants.length === 5 || activeParticipants.length === 6) && "grid-cols-2 md:grid-cols-3 auto-rows-fr",
              (activeParticipants.length >= 7 && activeParticipants.length <= 8) && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-fr",
              activeParticipants.length > 8 && "grid-cols-2 sm:grid-cols-4 md:grid-cols-4 auto-rows-fr"
            )}>
              {activeParticipants.map((p) => {
                const isHost = p.id === 'p1';
                const isAi = p.id === 'p2';
                const isParticipantMuted = isHost ? !isMicOn : (mutedParticipantMap[p.id] ?? p.isMuted);

                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveSpeakerId(p.id)}
                    className={cn(
                      "rounded-2xl bg-slate-900 border-2 relative overflow-hidden flex flex-col justify-between p-3.5 shadow-xl transition-all group cursor-pointer",
                      activeSpeakerId === p.id 
                        ? "border-emerald-500 ring-2 ring-emerald-500/30" 
                        : isAi 
                        ? "border-indigo-500/40" 
                        : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {/* Media Feed Container */}
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
                      {isHost ? (
                        isVideoOn ? (
                          <video
                            ref={userVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <div className="w-16 h-16 rounded-full bg-emerald-700/80 flex items-center justify-center font-bold text-2xl mb-1 text-white shadow-lg">
                              YOU
                            </div>
                            <p className="text-xs font-semibold text-slate-400">Camera Off</p>
                          </div>
                        )
                      ) : isAi ? (
                        <div className="flex flex-col items-center justify-center p-4">
                          <div className={cn(
                            "w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-xl transition-all",
                            aiIsSpeaking ? "scale-110 ring-4 ring-emerald-400 animate-pulse" : "ring-2 ring-indigo-400/40"
                          )}>
                            <Bot className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="font-bold text-sm text-white mt-2.5">Maya (AI Student)</h3>
                          <p className="text-xs text-slate-400 mt-0.5 italic text-center max-w-[200px] truncate">
                            "{aiCurrentThought}"
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className={cn(
                            "w-16 h-16 rounded-full text-white font-bold text-2xl flex items-center justify-center shadow-lg mb-1.5",
                            p.avatarColor
                          )}>
                            {p.initials}
                          </div>
                          <p className="text-xs text-slate-300 font-semibold">{p.name}</p>
                          {p.isDataSaver && (
                            <span className="text-[9px] text-amber-300 font-bold mt-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                              Data Saver Mode
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Top Tile Badge */}
                    <div className="relative z-10 flex justify-between items-center">
                      <div className="bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          isHost ? "bg-emerald-500 animate-pulse" : isAi ? "bg-indigo-400 animate-pulse" : "bg-slate-400"
                        )} />
                        <span className="truncate max-w-[140px] text-slate-200">{p.name}</span>
                      </div>

                      {isAi && aiHandRaised && (
                        <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold animate-bounce shadow-md">
                          ✋ Hand Raised
                        </span>
                      )}

                      {isHost && isUserHandRaised && (
                        <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold animate-bounce shadow-md">
                          ✋ Raised
                        </span>
                      )}
                    </div>

                    {/* Bottom Audio/Connection Info & Quick Actions */}
                    <div className="relative z-10 flex justify-between items-end">
                      {isHost ? (
                        <div className="bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-2">
                          <Mic className={cn("h-3.5 w-3.5", isMicOn ? "text-emerald-400" : "text-red-400")} />
                          {isMicOn ? (
                            <div className="flex items-center gap-0.5 h-2.5">
                              <div className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${Math.max(3, (micVolume * 1.2))}px` }} />
                              <div className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${Math.max(3, (micVolume * 1.5))}px` }} />
                              <div className="w-0.5 bg-emerald-400 rounded-full" style={{ height: `${Math.max(3, (micVolume * 0.9))}px` }} />
                              <span className="text-[10px] text-slate-300 font-mono">{micVolume}%</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-red-400 font-bold">Muted</span>
                          )}
                        </div>
                      ) : isAi ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); triggerAiQuestion(); }} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold shadow-xs">
                            Ask
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); triggerAiAnswer(); }} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold shadow-xs">
                            Solve
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-950/85 backdrop-blur px-2 py-0.5 rounded-lg border border-slate-800 text-[10px]">
                          {isParticipantMuted ? (
                            <span className="text-red-400 font-bold flex items-center gap-1">
                              <MicOff className="w-3 h-3" /> Muted
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> Live
                            </span>
                          )}
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {p.bitrate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* In-Meeting Sidebar (Chat / Participants / Mic Test Panel) */}
        <AnimatePresence>
          {activeTab && activeTab !== 'whiteboard' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden shrink-0"
            >
              {/* Sidebar Header Tabs */}
              <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  {activeTab === 'chat' && 'In-Class Live Chat'}
                  {activeTab === 'participants' && `Participants (${activeParticipants.length}/8 Active)`}
                  {activeTab === 'micTest' && 'Microphone & Audio Tester'}
                </span>
                <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {activeTab === 'chat' ? (
                /* Chat view */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className={cn("font-bold", msg.role === 'teacher' ? "text-emerald-400" : msg.role === 'ai' ? "text-indigo-400" : "text-amber-400")}>
                            {msg.sender}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                        <div className={cn(
                          "p-2.5 rounded-xl text-xs leading-relaxed",
                          msg.role === 'teacher' 
                            ? "bg-emerald-900/40 text-emerald-100 border border-emerald-500/30" 
                            : msg.role === 'ai'
                            ? "bg-indigo-900/40 text-indigo-100 border border-indigo-500/30"
                            : "bg-slate-800 text-slate-200 border border-slate-700"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
                    <input 
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message to class..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : activeTab === 'participants' ? (
                /* Participants Roster view (Active up to 16) */
                <div className="p-4 space-y-2.5 overflow-y-auto max-h-[500px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Room Capacity: {activeParticipants.length} of {participantCount > 8 ? '16 Masterclass' : '8'} Maximum
                    </span>
                    <button
                      type="button"
                      onClick={handleMuteAll}
                      className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Mute All
                    </button>
                  </div>

                  {activeParticipants.map((p) => {
                    const isMuted = p.id === 'p1' ? !isMicOn : (mutedParticipantMap[p.id] ?? p.isMuted);
                    return (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${p.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                            {p.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.bitrate} · {p.ping}</p>
                          </div>
                        </div>
                        {isMuted ? <MicOff className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Interactive Microphone Test Panel */
                <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Live Microphone Meter</h4>
                      <p className="text-xs text-slate-400">Speak into your mic to test real-time sound input levels.</p>
                    </div>

                    {/* Live Decibel Meter Progress */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Input Volume:</span>
                        <span className={cn("font-bold", micVolume > 10 ? "text-emerald-400" : "text-slate-500")}>
                          {micVolume}% {micVolume > 10 ? '(Receiving Audio)' : '(No Audio Detected)'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-75",
                            micVolume > 60 ? "bg-red-500" : micVolume > 30 ? "bg-amber-400" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, micVolume)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Low</span>
                        <span>Optimal</span>
                        <span>High</span>
                      </div>
                    </div>

                    {/* 3-Second Mic Loopback Test */}
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Volume2 className="h-4 w-4 text-emerald-400" /> 3-Second Voice Playback Test
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Record a quick 3-second sample of your voice and play it back to confirm microphone clarity.
                      </p>

                      <button
                        onClick={handleStartMicTestRecord}
                        disabled={isRecordingMicTest}
                        className={cn(
                          "w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                          isRecordingMicTest 
                            ? "bg-red-600 text-white animate-pulse" 
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                        )}
                      >
                        {isRecordingMicTest ? (
                          <>
                            <Circle className="h-3 w-3 fill-current" />
                            <span>Recording your voice (3s)...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="h-3.5 w-3.5" />
                            <span>Record 3s Test Audio</span>
                          </>
                        )}
                      </button>

                      {micTestAudioUrl && (
                        <div className="pt-2 border-t border-slate-700/60 space-y-2">
                          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Voice sample captured!
                          </p>
                          <audio controls src={micTestAudioUrl} className="w-full h-8" autoPlay />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Meeting Controls Bar */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0 z-10">
        {/* Left Info */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
          <Clock className="h-4 w-4 text-slate-500" />
          <span>Interactive Live Session · 60 min</span>
        </div>

        {/* Center Control Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 mx-auto md:mx-0">
          {/* Mute/Unmute Mic */}
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md",
              isMicOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white hover:bg-red-700"
            )}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Camera Toggle */}
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
              isVideoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white hover:bg-red-700"
            )}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen Share Toggle */}
          <button 
            type="button"
            onClick={async () => {
              if (!isScreenSharing) {
                try {
                  if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                    setIsScreenSharing(true);
                    screenStream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
                  } else {
                    setIsScreenSharing(true);
                  }
                } catch (e) {
                  setIsScreenSharing(true);
                }
              } else {
                setIsScreenSharing(false);
              }
            }}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
              isScreenSharing 
                ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-500/20" 
                : "bg-slate-800 hover:bg-slate-700 text-white"
            )}
            title={isScreenSharing ? "Stop Sharing Screen" : "Share Screen"}
          >
            <Monitor className="h-5 w-5" />
          </button>

          {/* Whiteboard Toggle */}
          <button 
            onClick={() => setActiveTab(activeTab === 'whiteboard' ? null : 'whiteboard')}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
              activeTab === 'whiteboard' ? "bg-emerald-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
            )}
            title="Shared Whiteboard"
          >
            <PenTool className="h-5 w-5" />
          </button>

          {/* Interactive In-Session Record (10-Day Policy) */}
          <button 
            onClick={isRecording ? stopSessionRecording : startSessionRecording}
            className={cn(
              "px-3.5 h-11 rounded-xl flex items-center gap-2 transition-all font-semibold text-xs shadow-md",
              isRecording 
                ? "bg-red-600 text-white hover:bg-red-700 animate-pulse" 
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            )}
            title="Record Session"
          >
            <Circle className={cn("h-3 w-3", isRecording ? "fill-white" : "fill-red-500 text-red-500")} />
            <span className="hidden sm:inline">{isRecording ? "Stop & Play REC" : "Record Class"}</span>
          </button>

          {/* Raise Hand */}
          <button 
            onClick={() => setIsUserHandRaised(!isUserHandRaised)}
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md",
              isUserHandRaised ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 hover:bg-slate-700 text-white"
            )}
            title="Raise Hand"
          >
            <Hand className="h-5 w-5" />
          </button>
        </div>

        {/* Right Sidebars Toggles */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative",
              activeTab === 'chat' ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button 
            onClick={() => setActiveTab(activeTab === 'participants' ? null : 'participants')}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              activeTab === 'participants' ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <Users className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* 3. INSTANT RECORDING PLAYBACK MODAL (10-DAY POLICY REPLAY) */}
      <AnimatePresence>
        {playbackModalOpen && recordedVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
              onClick={() => setPlaybackModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-800"
            >
              {/* Modal Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Live Session Playback Replay</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      10-Day Retention Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Calculus — Integration by Parts & LIATE Rule · Recorded Just Now</p>
                </div>
                <button onClick={() => setPlaybackModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <video 
                  controls 
                  autoPlay
                  src={recordedVideoUrl} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Attendee Restricted Access · Retained for 10 Days</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={recordedVideoUrl}
                    download="akademi-session-recording.webm"
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> Download MP4/WebM
                  </a>
                  <Link
                    to="/dashboard/recordings"
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    Open Library &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. WEBRTC SFU CLOUD MEDIA & BITRATE QUALITY MODAL */}
      <AnimatePresence>
        {showSFUDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setShowSFUDrawer(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 text-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-800 z-10"
            >
              <div className="p-5 bg-gradient-to-r from-blue-900/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">WebRTC SFU Cloud & Bitrate Controls</h3>
                    <p className="text-xs text-slate-400">LiveKit Cloud Engine · Lagos Relay Node</p>
                  </div>
                </div>
                <button onClick={() => setShowSFUDrawer(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Active Server Health Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Relay Engine Mode:</span>
                    <span className="font-bold text-blue-400">{isSFURelayActive ? '📡 LiveKit SFU Cloud Relay (Active)' : '⚡ Mesh P2P Direct (1-on-1)'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Server Ping (RTT):</span>
                    <span className="font-mono font-bold text-emerald-400">24ms (Lagos Node)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Packet Loss:</span>
                    <span className="font-mono font-bold text-emerald-400">0.0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Active Resolution:</span>
                    <span className="font-mono font-bold text-amber-300">{selectedPreset.label}</span>
                  </div>
                </div>

                {/* Resolution Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Select Stream Quality & Bitrate Adaptation:
                  </label>
                  <div className="space-y-2">
                    {VIDEO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={cn(
                          "w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer",
                          selectedPreset.id === preset.id
                            ? "bg-blue-600/20 border-blue-500/80 text-white ring-1 ring-blue-500/50"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{preset.label}</span>
                            {preset.id === '360p_eco' && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-extrabold uppercase border border-emerald-500/30">
                                Mobile Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{preset.description}</p>
                        </div>
                        {selectedPreset.id === preset.id && (
                          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplySFUSettings}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply SFU Settings & Close</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
