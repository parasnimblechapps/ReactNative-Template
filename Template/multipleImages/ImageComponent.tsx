import React, { useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { styles } from "./styles";

import { Color, FontFamily, FontSize } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@/components";
import ImageViewer from "react-native-image-zoom-viewer";
import { FlashList } from "@shopify/flash-list";
import { isTablet } from "@/utils/constants";
import CustomRenderHtml from "@/components/customRenderHtml/CustomRenderHtml";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

const ImageComponent = ({
  imagePaths,
  caption,
  handlePressBack,
  handleImageClick,
  handlePressShare,
}: {
  imagePaths: string[];
  caption: string[];
  handlePressBack: () => void;
  handleImageClick: () => void;
  handlePressShare: () => void;
}) => {
  const IMAGE_SIZE = isTablet ? 100 : 52;
  const SPACING = 10;
  const topRef = useRef(null);
  const thumbRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const ScrollSetActiveIndex = (index) => {
    setActiveIndex(index);

    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  //console.log("caption?.length", caption[activeIndex]);
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
        <TouchableOpacity activeOpacity={1} onPress={handlePressShare}>
          <Icon name="share" style={styles.shareButtonText}></Icon>
        </TouchableOpacity>
      </View>
      {imagePaths?.length > 0 && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlashList
              ref={topRef}
              data={imagePaths}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(ev) => {
                const index = Math.floor(
                  ev.nativeEvent.contentOffset.x / width
                );
                ScrollSetActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: width,
                    padding: 20,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleImageClick(item.url)}
                  >
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                      source={{ uri: item.url }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {caption?.length > 0 &&
            caption?.[activeIndex] != "" &&
            caption[activeIndex] !== "<p></p>" && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Color.TEXTCOLOR20,
                  paddingHorizontal: 20,
                  minHeight: isTablet ? 72 : 92,
                }}
              >
                <CustomRenderHtml
                  htmlContent={caption[activeIndex]}
                  tagsStyles={{
                    div: {
                      fontSize: isTablet ? FontSize.SIZE_14 : FontSize.SIZE_16,
                      color: Color.TEXTCOLOR50,
                      fontFamily: FontFamily.LIBRE_FRANKLIN_REGULAR,
                    },

                    em: {
                      fontSize: isTablet ? FontSize.SIZE_14 : FontSize.SIZE_16,
                      color: Color.TEXTCOLOR50,
                      fontFamily: FontFamily.LIBRE_FRANKLIN_ITALIC,
                    },
                    strong: {
                      fontSize: isTablet ? FontSize.SIZE_14 : FontSize.SIZE_16,
                      color: Color.TEXTCOLOR50,
                      fontFamily: FontFamily.LIBRE_FRANKLIN_Bold,
                    },
                  }}
                  systemFonts={[
                    FontFamily.LIBRE_FRANKLIN_REGULAR,
                    FontFamily.LIBRE_FRANKLIN_ITALIC,
                    FontFamily.LIBRE_FRANKLIN_Bold,
                  ]}
                />
              </View>
            )}
          <View
            style={{ height: isTablet ? 120 : 72, justifyContent: "center" }}
          >
            <FlashList
              ref={thumbRef}
              data={imagePaths}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={140}
              extraData={activeIndex} // <-- Add this line
              contentContainerStyle={{ paddingHorizontal: SPACING }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => ScrollSetActiveIndex(index)}
                >
                  <Image
                    style={{
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                      borderRadius: 4,
                      marginRight: SPACING,
                      borderWidth: 2,
                      borderColor:
                        activeIndex === index ? Color.BLUE : "transparent",
                    }}
                    source={{ uri: item.url }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};
export default ImageComponent;
