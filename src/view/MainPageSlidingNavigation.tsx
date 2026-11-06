import { Component, createRef, type ComponentRef, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PageIndex = 0 | 1 | 2 | 3 | 4;

type MainSliderProps = {
  activeIndex:
    | ["Home"]
    | ["Messages"]
    | ["Trainings"]
    | ["Members"]
    | ["Profile"];
  pages: readonly ReactNode[];
  renderNavigation: (props: {
    activeIndex: PageIndex;
    onSelect: (index: PageIndex) => void;
  }) => ReactNode;
};

type MainSliderState = {
  activeIndex: PageIndex;
  width: number;
};

export class MainPageSlidingNavigation extends Component<
  MainSliderProps,
  MainSliderState
> {
  state: MainSliderState = {
    activeIndex: 0,
    width: 0,
  };

  private sliderRef = createRef<ComponentRef<typeof ScrollView>>();
  private selectedIndex: PageIndex = 0;
  componentDidUpdate(_prevProps: MainSliderProps, prevState: MainSliderState) {
    const { width } = this.state;

    if (width > 0 && width !== prevState.width) {
      this.sliderRef.current?.scrollTo({
        x: this.selectedIndex * width,
        animated: false,
      });
    }
  }

  private onSelect = (index: PageIndex) => {
    const { width } = this.state;
    if (width <= 0) return;

    this.selectedIndex = index;
    this.setState({ activeIndex: index });

    this.sliderRef.current?.scrollTo({
      x: index * width,
      animated: false,
    });
  };

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { width } = this.state;
    if (width <= 0) return;

    const index = Math.max(
      0,
      Math.min(
        this.props.pages.length - 1,
        Math.round(event.nativeEvent.contentOffset.x / width),
      ),
    ) as PageIndex;

    const activeIndex1 = [
      "Home",
      "Messages",
      "Trainings",
      "Members",
      "Profile",
    ] as const;

    if (index !== this.selectedIndex) {
      this.selectedIndex = index;
      this.setState({ activeIndex: index });
      this.props.activeIndex[0] = activeIndex1[index];
    }
  };

  render() {
    const { pages, renderNavigation } = this.props;
    const { activeIndex, width } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={styles.pager}
          onLayout={(event) => {
            const nextWidth = event.nativeEvent.layout.width;

            if (nextWidth !== width) {
              this.setState({ width: nextWidth });
            }
          }}
        >
          {width > 0 && (
            <ScrollView
              ref={this.sliderRef}
              style={styles.pager}
              horizontal
              pagingEnabled
              directionalLockEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              removeClippedSubviews={false}
              scrollEventThrottle={16}
              onScroll={this.onScroll}
            >
              {pages.map((page, index) => (
                <View
                  key={index}
                  style={[styles.page, { width }]}
                  accessibilityElementsHidden={activeIndex !== index}
                  importantForAccessibility={
                    activeIndex === index ? "auto" : "no-hide-descendants"
                  }
                >
                  {page}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <SafeAreaView edges={["bottom"]} style={styles.navigation}>
          {renderNavigation({
            activeIndex,
            onSelect: this.onSelect,
          })}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    height: "100%",
  },
  navigation: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
});
