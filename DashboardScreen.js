import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const [pressedCard, setPressedCard] = useState(null);

  const handlePressIn = (id) => {
    setPressedCard(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    setPressedCard(null);
  };

  const renderTodoCard = (id, title, color1, color2) => (
    <Pressable
      key={id}
      onPressIn={() => handlePressIn(id)}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.todoWrapper,
        pressed && styles.todoWrapperPressed
      ]}
    >
      <BlurView tint="light" intensity={80} style={styles.todoCard}>
        <LinearGradient colors={[color1, color2]} style={styles.iconCircle} />
        <Text style={styles.todoText}>{title}</Text>
      </BlurView>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* The Central Day Dial */}
      <View style={styles.dialContainer}>
        <View style={styles.dialOuterRing}>
          <LinearGradient colors={['#ab1c1c', '#7f0c0c']} style={styles.dialInnerFace}>
            <Text style={styles.dayLabel}>DAY</Text>
            <Text style={styles.dayNumber}>19</Text>
          </LinearGradient>
        </View>
      </View>

      {/* The Interactive Mission Cards */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>MISSIONS</Text>
        {renderTodoCard(1, 'Log Morning Weight', '#2567ff', '#7ea7ff')}
        {renderTodoCard(2, 'Update Grocery Roster', '#eb6a2d', '#ff9b61')}
        {renderTodoCard(3, 'Evening Hydration Check', '#1ea35d', '#77d39a')}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingTop: 80, paddingBottom: 120, alignItems: 'center' },
  dialContainer: { marginBottom: 40, shadowColor: '#14171a', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 30 },
  dialOuterRing: { width: 220, height: 220, borderRadius: 110, backgroundColor: '#fffaf3', padding: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(20,23,26,0.05)' },
  dialInnerFace: { width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fffaf3' },
  dayLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '800', letterSpacing: 4, marginBottom: -5 },
  dayNumber: { color: '#ffffff', fontSize: 72, fontWeight: '900' },
  listContainer: { width: '100%', paddingHorizontal: 20 },
  sectionTitle: { color: '#6d7780', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 15, marginLeft: 10 },
  todoWrapper: { marginBottom: 15, borderRadius: 24 },
  todoWrapperPressed: { transform: [{ scale: 0.97 }] }, // Compresses visually on touch
  todoCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' },
  iconCircle: { width: 16, height: 16, borderRadius: 8, marginRight: 15 },
  todoText: { color: '#14171a', fontSize: 17, fontWeight: '600' }
});