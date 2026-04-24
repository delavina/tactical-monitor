import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { VIDEO_FILE } from '@env';

const { width, height } = Dimensions.get('window');

// Try to use video, fallback to image if not available
const USE_VIDEO = false; // TODO: Set to true to use video
const VIDEO_SOURCE = null; // Placeholder to prevent build error
//const VIDEO_SOURCE = require(`../assets/${VIDEO_FILE || 'your_video_file.mp4'}`);

const IMAGE_SOURCE = require('../assets/Insert_grey_clean.jpg'); // Fallback image

// TODO: Drop your desired video file into tactical-monitor/assets/.
// TODO: Set the line `const USE_VIDEO = false;` to true to use video
// TODO: Uncomment that line: const VIDEO_SOURCE = null;
// TODO: Uncomment that line: const VIDEO_SOURCE = require(`../assets/${VIDEO_FILE || 'your_video_file.mp4'}`);
// TODO: Set USE_VIDEO = true.

export default function TrajectoryCalculationMonitor() {
  const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [badgeText, setBadgeText] = useState('CALCULATING TRAJECTORY');
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const badgeOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scanning line animation (vertical)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse ring animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate dashed ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSidebarClick = () => {
    setSidebarExpanded(!sidebarExpanded);
    
    // Start the timer on sidebar click
    if (badgeText === 'CALCULATING TRAJECTORY') {
      // First timeout: Change text after 12 seconds
      setTimeout(() => {
        setBadgeText('TARGET LOCKED');
        
        // Second timeout: Fade out badge after additional 4 seconds (16s total)
        setTimeout(() => {
          Animated.timing(badgeOpacityAnim, {
            toValue: 0,
            duration: 1000, // 1 second fade-out
            useNativeDriver: true,
          }).start();
        }, 1000); // TODO: 1 second delay has been 4 seconds
      }, 4000); // TODO: 4 seconds delay has been 12 seconds
    }
  };

  const handleResetScene = () => {
    setBadgeText('CALCULATING TRAJECTORY');
    setSidebarExpanded(false);
    badgeOpacityAnim.setValue(1); // Reset opacity
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />
      
      {/* Center - Full Screen Scope View */}
      <View style={styles.scopeContainer}>
        {/* Background Layer */}
        {USE_VIDEO ? (
          <VideoView
            player={player}
            style={[styles.scopeBackground, StyleSheet.absoluteFill]}
            contentFit="contain"
            nativeControls={false}
          />
        ) : (
          <Image
            source={IMAGE_SOURCE}
            style={[styles.scopeBackground]}
            resizeMode="contain"
          />
        )}

        {/* Content Layer - Vignette & HUD */}
        <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
          {/* Vignette */}
          <View style={styles.vignette} />
          
          {/* Scanline Pattern */}
          <View style={styles.scanlinePattern} />
          
          {/* Animated Scanning Line */}
          <Animated.View 
            style={[
              styles.scanningLine,
              { transform: [{ translateY: scanLineTranslate }] }
            ]} 
          />

          {/* Targeting Rings & Center */}
          <View style={styles.targetingContainer}>
            {/* Rotating Dashed Ring */}
            <Animated.View 
              style={[
                styles.dashedRing,
                { transform: [{ rotate }] }
              ]}
            />
            
            {/* Pulsing Ring */}
            <Animated.View 
              style={[
                styles.pulsingRing,
                { transform: [{ scale: pulseAnim }] }
              ]}
            />

            {/* Status Labels */}
            <View style={styles.statusLabels}>
              <View style={styles.calculatingLabel}>
                <Text style={styles.calculatingText}>CALCULATING SOLUTION...</Text>
              </View>
              <View style={styles.windLabel}>
                <Text style={styles.windText}>WIND DRIFT ADJ...</Text>
              </View>
              <Text style={styles.syncLabel}>SYNC_B_042</Text>
            </View>

            {/* Center Reticle */}
            <View style={styles.centerReticle}>
              <View style={styles.verticalLine} />
              <View style={styles.horizontalLine} />
              <View style={styles.centerCross}>
                <View style={styles.centerVertical} />
                <View style={styles.centerHorizontal} />
                <View style={styles.centerDot} />
              </View>
              
              {/* Range Marks */}
              <View style={styles.rangeMarks}>
                <View style={styles.markLine} />
                <View style={styles.markLineShort} />
                <View style={styles.markLine} />
              </View>
            </View>

            {/* Calculating Badge */}
            <Animated.View style={[styles.calculatingBadge, { opacity: badgeOpacityAnim }]}>
              <Text style={styles.calculatingBadgeText}>{badgeText}</Text>
            </Animated.View>
          </View>

          {/* Top Status Bar */}
          <View style={styles.topStatus}>
            <View style={styles.liveFeedBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveFeedText}>LIVE FEED</Text>
            </View>
            <View style={styles.gpsLockBadge}>
              <Ionicons name="bonfire-outline" size={12} color="#4ade80" />
              <Text style={styles.gpsLockText}>GPS LOCK: 34.0522 N</Text>
            </View>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>FOV</Text>
              <Text style={styles.infoValue}>3.2°</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>ZOOM</Text>
              <Text style={styles.infoValue}>12.5X</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Sidebar - Collapsible AMMO PROFILE - ABSOLUTE POSITIONED */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSidebarClick}
        style={[styles.rightSidebar, sidebarExpanded && styles.rightSidebarExpanded]}
      >
        <View style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <Ionicons name="aperture-outline" size={16} color="#fbbf24" />
            {sidebarExpanded && (
              <Text style={styles.sidebarTitle}>AMMO PROFILE</Text>
            )}
          </View>

          {/* Ammo Cards */}
          <View style={styles.ammoCards}>
            <View style={[styles.ammoCard, styles.ammoCardGreen]}>
              {sidebarExpanded && <Text style={styles.ammoLabel}>CALIBER</Text>}
              <Text style={[styles.ammoValue, !sidebarExpanded && styles.ammoValueCenter]}>.338LP</Text>
            </View>

            <View style={styles.ammoCard}>
              {sidebarExpanded && <Text style={styles.ammoLabel}>GRAIN</Text>}
              <Text style={[styles.ammoValue, !sidebarExpanded && styles.ammoValueCenter]}>250gr</Text>
            </View>

            <View style={styles.ammoCard}>
              {sidebarExpanded && <Text style={styles.ammoLabel}>TARGET RANGE</Text>}
              <Text style={[styles.ammoValue, !sidebarExpanded && styles.ammoValueCenter]}>
                870{sidebarExpanded && <Text style={styles.ammoUnit}>m/s</Text>}
              </Text>
            </View>

            <View style={[styles.ammoCard, styles.ammoCardAmber]}>
              {sidebarExpanded && <Text style={styles.ammoLabel}>B.C.</Text>}
              <Text style={[styles.ammoValue, !sidebarExpanded && styles.ammoValueCenter]}>.650</Text>
            </View>
          </View>

          {/* Edit Button */}
          {sidebarExpanded && (
            <TouchableOpacity style={styles.editButton} onPress={handleResetScene}>
              <Text style={styles.editButtonText}>EDIT LOAD</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Left Sidebar - Environment Data - ABSOLUTE POSITIONED */}
      <View style={styles.leftSidebar}>
        <ScrollView style={styles.envScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.envHeader}>
            <Text style={styles.envHeaderTitle}>ENVIRONMENT</Text>
            <Text style={styles.envHeaderStatus}>STABLE</Text>
          </View>

          {/* Target Range - Primary */}
          <View style={styles.rangeCard}>
            <Text style={styles.rangeLabel}>VELOCITY</Text>
            <View style={styles.rangeValueRow}>
              <Text style={styles.rangeValue}>4240</Text>
            </View>
              <Text style={styles.rangeUnit}>Meter / Sec</Text>
          </View>

          {/* Environment Data Grid */}
          <View style={styles.envGrid}>
            <View style={styles.envDataCard}>
              <Text style={styles.envDataLabel}>WIND</Text>
              <Text style={styles.envDataValueAmber}>4 mph NE</Text>
            </View>
            <View style={styles.envDataCard}>
              <Text style={styles.envDataLabel}>ELEVATION</Text>
              <Text style={styles.envDataValue}>12.4 MIL</Text>
            </View>
            <View style={styles.envDataCard}>
              <Text style={styles.envDataLabel}>WINDAGE</Text>
              <Text style={styles.envDataValue}>1.2 MIL</Text>
            </View>
            <View style={styles.envDataCard}>
              <Text style={styles.envDataLabel}>TEMP</Text>
              <Text style={styles.envDataValue}>22°C</Text>
            </View>
          </View>

          {/* Impact Velocity */}
          <View style={styles.impactVel}>
            <View style={styles.impactVelHeader}>
              <Text style={styles.impactVelLabel}>IMP VEL</Text>
              <Text style={styles.impactVelValue}>4240 m/s</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.recButton}>
              <Ionicons name="videocam" size={14} color="#ef4444" />
              <Text style={styles.buttonLabel}>REC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lazeButton}>
              <Ionicons name="resize" size={14} color="#1173d4" />
              <Text style={styles.buttonLabel}>LAZE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Scope Container - FULL SCREEN
  scopeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  scopeBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanlinePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  scanningLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#4ade80',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  targetingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderStyle: 'dashed',
  },
  pulsingRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.6)',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  statusLabels: {
    position: 'absolute',
    width: 400,
    height: 400,
  },
  calculatingLabel: {
    position: 'absolute',
    top: '20%',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderLeftWidth: 2,
    borderLeftColor: '#4ade80',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  calculatingText: {
    color: '#4ade80',
    fontSize: 8,
    fontWeight: 'bold',
  },
  windLabel: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRightWidth: 2,
    borderRightColor: '#fbbf24',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  windText: {
    color: '#fbbf24',
    fontSize: 8,
    fontWeight: 'bold',
  },
  syncLabel: {
    position: 'absolute',
    right: -20,
    top: '50%',
    transform: [{ rotate: '90deg' }],
    color: '#9ca3af',
    fontSize: 7,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  centerReticle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    position: 'absolute',
    width: 0.5,
    height: height,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  horizontalLine: {
    position: 'absolute',
    height: 0.5,
    width: width,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  centerCross: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerVertical: {
    position: 'absolute',
    width: 1,
    height: 48,
    backgroundColor: '#4ade80',
  },
  centerHorizontal: {
    position: 'absolute',
    height: 1,
    width: 48,
    backgroundColor: '#4ade80',
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  rangeMarks: {
    position: 'absolute',
    top: -120,
    gap: 24,
  },
  markLine: {
    width: 16,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  markLineShort: {
    width: 8,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  calculatingBadge: {
    position: 'absolute',
    top: 256,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  calculatingBadgeText: {
    color: '#4ade80',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  topStatus: {
    position: 'absolute',
    top: 16,
    left: 216,  // 200px sidebar + 16px padding
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  liveFeedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
  },
  liveFeedText: {
    color: '#fbfbfb',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  gpsLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  gpsLockText: {
    color: '#d4d4d8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 16,
    left: 216,  // 200px sidebar + 16px padding
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 8,
    minWidth: 60,
  },
  infoLabel: {
    color: '#71717a',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  infoValue: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Left Sidebar - ENVIRONMENT - ABSOLUTE POSITIONED LEFT
  leftSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 180,
    backgroundColor: '#0c1218',
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    zIndex: 100,
  },
  envScroll: {
    flex: 1,
    padding: 12,
  },
  envHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 8,
    marginBottom: 12,
  },
  envHeaderTitle: {
    color: '#9ca3af',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  envHeaderStatus: {
    color: '#4ade80',
    fontSize: 8,
    fontFamily: 'monospace',
  },
  rangeCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  rangeLabel: {
    color: '#4ade80',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  rangeValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rangeValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  rangeUnit: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  envGrid: {
    gap: 8,
    marginBottom: 12,
  },
  envDataCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 2,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  envDataLabel: {
    color: '#71717a',
    fontSize: 7,
    fontWeight: 'bold',
  },
  envDataValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  envDataValueAmber: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: 'bold',
  },
  impactVel: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 12,
    marginBottom: 12,
  },
  impactVelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  impactVelLabel: {
    color: '#71717a',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  impactVelValue: {
    color: '#71717a',
    fontSize: 7,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#27272a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#fbbf24',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  recButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.4)',
    borderRadius: 2,
  },
  lazeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: 'rgba(17, 115, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(17, 115, 212, 0.3)',
    borderRadius: 2,
  },
  buttonLabel: {
    color: '#9ca3af',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Right Sidebar - AMMO - ABSOLUTE POSITIONED RIGHT
  rightSidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 72,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderLeftWidth: 1,
    borderLeftColor: '#27272a',
    zIndex: 100,
  },
  rightSidebarExpanded: {
    width: 160,
  },
  sidebarContent: {
    flex: 1,
    paddingVertical: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  ammoCards: {
    paddingHorizontal: 8,
    gap: 16,
  },
  ammoCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderLeftWidth: 2,
    borderLeftColor: '#3f3f46',
    padding: 8,
  },
  ammoCardGreen: {
    borderLeftColor: '#4ade80',
  },
  ammoCardAmber: {
    borderLeftColor: '#fbbf24',
  },
  ammoLabel: {
    color: '#71717a',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  ammoValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ammoValueCenter: {
    textAlign: 'center',
  },
  ammoUnit: {
    color: '#71717a',
    fontSize: 7,
    marginLeft: 4,
  },
  editButton: {
    marginTop: 'auto',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 2,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#4ade80',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
