import { View, Text, StyleSheet } from "react-native";

export const Home: React.FC = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bikes for everyone</Text>
        <Text>
          Launched in 2007, Vélib' Métropole is a pioneer of bike-sharing
          service in the world.
        </Text>
        <Text>
          Vélib’ Métropole aims to promote new mobility in the Greater Paris
          area.
        </Text>
        <Text>
          Our service counts several million journeys each month, making Vélib’
          a key operator in public transportation.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
