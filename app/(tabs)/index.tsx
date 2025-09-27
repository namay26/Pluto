import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const carouselData = [
  {
    id: 0,
    icon: 'shield-checkmark-outline',
    title: 'Easy and Secure',
    subtitle: 'Cryptocurrency transactions are secure and traceable, making them a favorite.',
  },
  {
    id: 1,
    icon: 'swap-horizontal-outline',
    title: 'Exchange Coins',
    subtitle: 'Seamlessly exchange between different cryptocurrencies with competitive rates.',
  },
  {
    id: 2,
    icon: 'trending-up-outline',
    title: 'Profit and Loss',
    subtitle: 'Track your portfolio performance and analyze your trading profits and losses.',
  },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    router.push('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.carousel}
          contentContainerStyle={styles.carouselContent}
        >
          {carouselData.map((item) => (
            <View key={item.id} style={styles.carouselItem}>
              {/* Main Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.circleBackground}>
                  <Ionicons name={item.icon as any} size={60} color="white" />
                </View>
              </View>

              {/* Title and Subtitle */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  carousel: {
    flexGrow: 0,
    height: 400,
    width: width,
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselItem: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    flex: 1,
  },
  iconContainer: {
    marginBottom: 60,
  },
  circleBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.textMuted,
  },
  progressDotActive: {
    backgroundColor: AppColors.accent,
    width: 24,
    borderRadius: 12,
  },
  nextButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    width: '40%',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  nextButtonText: {
    color: AppColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
