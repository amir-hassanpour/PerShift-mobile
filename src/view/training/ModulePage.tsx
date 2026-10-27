import { Module } from "@/entity/Module";
import { router } from "expo-router";
import { Component } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ModulePageProps = {
  module: Module;
};

export class ModulePage extends Component<ModulePageProps> {
  render() {
    const { module } = this.props;

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.brandHeader}>
          <Text style={styles.brandName}>
            Per<Text style={styles.brandAccent}>Shift</Text>
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backLabel}>‹ Back</Text>
          </Pressable>

          <Text accessibilityRole="header" style={styles.header}>
            {module.header}
          </Text>

          {module.content.length === 0 && (
            <Text style={styles.emptyText}>
              No content has been added to this module yet.
            </Text>
          )}

          {module.content.map((block) => {
            switch (block.type) {
              case "text":
                return (
                  <Text key={block.id} style={styles.text}>
                    {block.text}
                  </Text>
                );

              case "image":
                return (
                  <View key={block.id} style={styles.imageContainer}>
                    <Image
                      source={{ uri: block.url }}
                      accessible
                      accessibilityLabel={block.alt || "Module image"}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </View>
                );

              case "video":
                return (
                  <Pressable
                    key={block.id}
                    accessibilityRole="link"
                    accessibilityLabel="Open training video"
                    onPress={() => {
                      Linking.openURL(block.url).catch((error) => {
                        console.error("Could not open video:", error);
                      });
                    }}
                    style={({ pressed }) => [
                      styles.videoButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.playIcon}>
                      <Text style={styles.playSymbol}>▶</Text>
                    </View>

                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle}>Training video</Text>
                      <Text style={styles.videoSubtitle}>
                        Tap to open video
                      </Text>
                    </View>

                    <Text style={styles.videoArrow}>›</Text>
                  </Pressable>
                );
            }
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  brandHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 18,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 25,
    fontWeight: "800",
    color: "#152A4A",
    letterSpacing: -1,
  },
  brandAccent: {
    color: "#2563EB",
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#EAF1FF",
  },
  backLabel: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: "#152A4A",
    letterSpacing: -0.4,
  },
  text: {
    fontSize: 16,
    lineHeight: 27,
    color: "#425675",
  },
  imageContainer: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#F5F8FF",
  },
  image: {
    width: "100%",
    height: 240,
  },
  videoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F5F8FF",
    borderWidth: 1,
    borderColor: "#E2EAF7",
  },
  playIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF1FF",
  },
  playSymbol: {
    fontSize: 20,
    color: "#2563EB",
  },
  videoInfo: {
    flex: 1,
    gap: 4,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#152A4A",
  },
  videoSubtitle: {
    fontSize: 14,
    color: "#718099",
  },
  videoArrow: {
    fontSize: 28,
    color: "#2563EB",
  },
  pressed: {
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#718099",
    textAlign: "center",
    paddingVertical: 24,
  },
});
