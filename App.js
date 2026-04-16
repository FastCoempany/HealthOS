import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';

// This pulls in the Dashboard screen we build below
import DashboardScreen from './DashboardScreen';

// Temporary placeholders for Rotary and Missions so the app doesn't crash
const RotaryScreen = () => <View style={styles.screen}><Text style={styles.text}>Rotary Deck</Text></View>;
const MissionsScreen = () => <View style={styles.screen}><Text style={styles.text}>Control Board</Text></View>;

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.appBackground}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.floatingTabBar,
            tabBarBackground: () => (
              <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
            ),
            tabBarActiveTintColor: '#2567ff',
            tabBarInactiveTintColor: '#6d7780',
            tabBarShowLabel: true,
          }}
          screenListeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            },
          }}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Rotary" component={RotaryScreen} />
          <Tab.Screen name="Missions" component={MissionsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: '#f5f2ea',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#14171a',
    fontSize: 18,
    fontWeight: '600',
  },
  floatingTabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 0,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  }
});