import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TacticalBallisticMonitor from './components/TrajectoryCalculationMonitor';
/* import TestComponent from './components/TestComp';
 */
export default function App() {
  return (
    <View style={styles.container}>
    <TacticalBallisticMonitor /> 
    {/* <TestComponent />  */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
