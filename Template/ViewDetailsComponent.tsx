import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { styles } from "./styles";

import { Color } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArticleDetails from "@/components/articleDetails/ArticleDetails";
import CustomTabView from "@/components/customTabs";
import { TAB_ROUTES } from "@/constants";
import TextSizeIncreasor from "@/components/textSizeIncreasor";
import { SharedValue } from "react-native-reanimated";
const { width } = Dimensions.get("window");

import ShimmerEffect from "@/components/shimmerEffect/ShimmerEffect";
import { State } from "react-native-gesture-handler";

const ViewDetailsComponent = ({
  handlePressBack,
  onFlatListLayout,
  handleFlatListScroll,
  getItemLayout,
  handlePressMoreImage,
  handlePress,
  onPressClose,
  onValueChange,
  toggleModal,
  onSlidingComplete,
  handleImageClick,

  filteredIssues,
  flatListHeight,
  scrollViewRef,
  flatListRef,
  scrollIndex,
  selectedIndex,
  isFav,
  min,
  max,
  progress,
  isOpen,
  issueId,
}: {
  handlePressBack: () => void;
  onFlatListLayout: () => void;
  handleFlatListScroll: () => void;
  getItemLayout: () => void;
  handlePressMoreImage: () => void;
  handlePress: () => void;
  onPressClose: () => void;
  onValueChange: () => void;
  toggleModal: () => void;
  onSlidingComplete: (value: number) => void;
  handleImageClick: () => void;

  filteredIssues: IssueLimitData[];
  flatListHeight: any;
  scrollViewRef: any;
  flatListRef: any;
  scrollIndex: any;
  selectedIndex: any;
  isFav: boolean;
  min: SharedValue<number>;
  max: SharedValue<number>;
  progress: SharedValue<number>;
  isOpen: boolean;
  issueId: string;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        style="dark" // or "light" depending on your background
        backgroundColor={Color.BACKGROUNDGRAY} // This might not work as expected on iOS
      />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={handlePressBack}>
          <Icon name="left-arrow" style={styles.backButtonText}></Icon>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 50,
          height: flatListHeight + insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={scrollViewRef}
      >
        <View style={styles.mainView}>
          {filteredIssues?.length > 0 && (
            <Animated.FlatList
              ref={flatListRef}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              data={filteredIssues}
              extraData={filteredIssues}
              horizontal
              pagingEnabled
              renderToHardwareTextureAndroid
              initialScrollIndex={scrollIndex}
              windowSize={2}
              getItemLayout={getItemLayout}
              keyExtractor={(item) => item.Issue.NodeId}
              onScroll={handleFlatListScroll}
              renderItem={({ item, index }) => {
                const shouldRenderDetails =
                  Platform.OS === "android"
                    ? !!item.Issue.NodeId
                    : item.Issue.NodeId && index === scrollIndex;

                return shouldRenderDetails ? (
                  <ArticleDetails
                    index={index}
                    item={item}
                    isSingle={false}
                    issueId={issueId}
                    onFlatListLayout={onFlatListLayout}
                    handlePressMoreImage={handlePressMoreImage}
                    handleImageClick={handleImageClick}
                  />
                ) : (
                  <ShimmerEffect width={width} />
                );
              }}
            />
          )}
        </View>
      </ScrollView>

      <CustomTabView
        routes={TAB_ROUTES}
        selectedIndex={selectedIndex}
        onPress={handlePress}
        isFav={isFav}
      />

      <TextSizeIncreasor
        max={max}
        min={min}
        onPressClose={onPressClose}
        onValueChange={onValueChange}
        progress={progress}
        isOpen={isOpen}
        toggleModal={toggleModal}
        onSlidingComplete={onSlidingComplete}
      />
    </View>
  );
};
export default ViewDetailsComponent;
