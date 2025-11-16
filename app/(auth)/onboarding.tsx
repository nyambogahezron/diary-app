import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: 'book-outline',
    title: 'Welcome to Your Diary',
    description: 'Capture your thoughts, memories, and moments in a beautiful, private space.',
    color: '#3B82F6',
  },
  {
    id: 2,
    icon: 'lock-closed-outline',
    title: 'Secure & Private',
    description: 'Your entries are encrypted and protected with PIN and biometric authentication.',
    color: '#10B981',
  },
  {
    id: 3,
    icon: 'calendar-outline',
    title: 'Track Your Journey',
    description: 'Organize entries by date, mood, and tags. Find what you need instantly.',
    color: '#8B5CF6',
  },
  {
    id: 4,
    icon: 'sparkles-outline',
    title: 'Rich Features',
    description: 'Add photos, videos, voice notes, and use templates to enhance your journaling experience.',
    color: '#F59E0B',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingComplete } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    try {
      await markOnboardingComplete();
      router.replace('/(auth)/setup');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(auth)/setup');
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="auto" />
      
      {/* Skip Button */}
      <TouchableOpacity
        onPress={handleSkip}
        className="absolute top-12 right-6 z-10 px-4 py-2"
      >
        <Text className="text-gray-600 dark:text-gray-400 text-base font-medium">
          Skip
        </Text>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <Animated.ScrollView
        ref={scrollViewRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
      >
        {onboardingData.map((item, index) => (
          <OnboardingPage key={item.id} item={item} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center mb-8">
        {onboardingData.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            scrollX={scrollX}
            currentIndex={currentIndex}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 rounded-full py-4 items-center justify-center shadow-lg"
          style={{
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-white text-lg font-semibold">
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface OnboardingPageProps {
  item: typeof onboardingData[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}

function OnboardingPage({ item, index, scrollX }: OnboardingPageProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale: withSpring(scale, { damping: 15 }) }],
      opacity: withTiming(opacity, { duration: 300 }),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: withTiming(translateY, { duration: 300 }) }],
      opacity: withTiming(opacity, { duration: 300 }),
    };
  });

  const circleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale: withSpring(scale, { damping: 15 }) }],
    };
  });

  return (
    <View style={{ width, height: height * 0.7 }} className="items-center justify-center px-8">
      {/* Animated Circle Background */}
      <Animated.View
        style={[
          circleStyle,
          {
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: width * 0.35,
            backgroundColor: item.color + '20',
            position: 'absolute',
          },
        ]}
      />

      {/* Animated Icon */}
      <Animated.View style={iconStyle} className="mb-8">
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: item.color + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={item.icon as any} size={64} color={item.color} />
        </View>
      </Animated.View>

      {/* Animated Text */}
      <Animated.View style={textStyle} className="items-center">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
          {item.title}
        </Text>
        <Text className="text-lg text-gray-600 dark:text-gray-400 text-center leading-7">
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
}

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  currentIndex: number;
}

function PaginationDot({ index, scrollX, currentIndex }: PaginationDotProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const dotStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      width: withTiming(width, { duration: 300 }),
      opacity: withTiming(opacity, { duration: 300 }),
    };
  });

  return (
    <Animated.View
      style={[
        dotStyle,
        {
          height: 8,
          borderRadius: 4,
          backgroundColor: currentIndex === index ? '#3B82F6' : '#D1D5DB',
          marginHorizontal: 4,
        },
      ]}
    />
  );
}

