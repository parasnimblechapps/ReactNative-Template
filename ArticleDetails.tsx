import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
} from "react-native";
import { Color, FontFamily, FontSize } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import CustomRenderHtml from "../customRenderHtml/CustomRenderHtml";
import { getFontSize, isTablet, URL_COMMON } from "@/utils/constants";
import { getImagePathsWithCaptions, getJournalists } from "@/hooks/getAllData";
import { styles } from "./styles";
import ImageWithCaption from "../ImageWithCaption/ImageWithCaption";
import CustomRenderHtmlWithImage from "../customRenderHtmlDetails/CustomRenderHtmlDetails";
import VideoPlayer from "react-native-video-player";
import YoutubePlayer from "react-native-youtube-iframe";
import { useAppDispatch } from "@/hooks/storeHooks";
import CustomRenderHtmlDetails from "../customRenderHtmlDetails/CustomRenderHtmlDetails";

const ArticleDetails = ({
  item,
  index,
  isSingle,
  issueId,
  onFlatListLayout,
  handlePressMoreImage,
  handleImageClick,
}: {
  item: IssueLimitData;
  index: Number;
  isSingle: boolean;
  issueId: string;
  onFlatListLayout: () => void;
  handlePressMoreImage: () => void;
  handleImageClick: () => void;
}) => {
  const { width } = Dimensions.get("window");
  const dispatch = useAppDispatch();

  const [journalist, setJournalist] = useState<Journalist | null>(null);
  const [imagePaths, setImagePaths] = useState([]);
  const [imageMore, setImageMore] = useState([]);
  const [isVideo, setIsVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getJournalists(
          item.Issue.Journalists[0].string[0],
          isSingle,
          issueId
        );
        setJournalist(result);
      } catch (error) {
        console.error("Error fetching image path:", error);
      }
    };

    fetchData();
  }, [item]);

  const handlePress = () => {
    const url = URL_COMMON + journalist?.Url;
    console.log(url);
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("NodeID", item.Issue.NodeId);

        const galleryImagesString = item.Issue.GalleryImages[0].string;

        if (galleryImagesString) {
          setImageMore(galleryImagesString);
        }
        const ImageID = item.Issue.Image;
        const imageIdArray = Array.isArray(ImageID) ? ImageID : [ImageID];

        const fetchedImagePaths = await getImagePathsWithCaptions(
          imageIdArray,
          isSingle,
          issueId
        );
        setImagePaths(fetchedImagePaths);

        const videoUrl = item.Issue.VideoUrl[0];
        if (videoUrl != null) {
          // console.log("videoUrl", videoUrl);
          setIsVideo(true);
          setVideoUrl(videoUrl);
          setIsYouTube(
            videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
          );
        }
      } catch (error) {
        console.error("Error fetching image path:", error);
      }
    };

    fetchData();
  }, [item]);

  return (
    <View style={styles.container}>
      <View style={[styles.containerView]} onLayout={onFlatListLayout(index)}>
        {/* Title :- Name */}
        <CustomRenderHtml
          htmlContent={item.Issue.Name}
          tagsStyles={{
            div: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_24 : FontSize.SIZE_20
              ),
              color: Color.TEXTCOLOR,
              fontFamily: Platform.OS === 'ios' ? FontFamily.MERRIWATHER_REGULAR : FontFamily.MERRIWATHER_BOLD,
              fontStyle: 'normal',
            },
            em: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_24 : FontSize.SIZE_20
              ),
              color: Color.TEXTCOLOR,
              fontFamily: Platform.OS === 'ios' ? FontFamily.MERRIWATHER_ITALIC : FontFamily.MERRIWATHER_BOLD_ITALIC,
              fontStyle: 'normal',
            },
            strong: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_24 : FontSize.SIZE_20
              ),
              color: Color.TEXTCOLOR,
              fontFamily: FontFamily.MERRIWATHER_BOLD,
              fontStyle: 'normal',
            },
          }}
          systemFonts={[
            FontFamily.MERRIWATHER_REGULAR,
            FontFamily.MERRIWATHER_ITALIC,
            FontFamily.MERRIWATHER_BOLD,
            FontFamily.MERRIWATHER_BOLD_ITALIC,
          ]}
        />

        {/* Journalists Name  :- Journalists */}
        {journalist ? (
          <View style={styles.journalistNameTextView}>
            <Text
              style={[
                styles.journalistNameText,
                {
                  fontSize: getFontSize(
                    item.ProgressValue,
                    isTablet ? FontSize.SIZE_18 : FontSize.SIZE_14
                  ),
                },
              ]}
            >
              by{" "}
            </Text>
            <TouchableOpacity activeOpacity={1} onPress={handlePress}>
              <Text
                style={[
                  styles.journalistName,
                  {
                    fontSize: getFontSize(
                      item.ProgressValue,
                      isTablet ? FontSize.SIZE_18 : FontSize.SIZE_14
                    ),
                  },
                ]}
              >
                {journalist.Name}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          ""
        )}

        {/* Subheading Title   :- Subheading */}
        <CustomRenderHtml
          htmlContent={item.Issue.Subheading}
          tagsStyles={{
            div: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_20 : FontSize.SIZE_16
              ),
              color: Color.TEXTCOLOR,
              fontFamily: Platform.OS === 'ios' ? FontFamily.MERRIWATHER_REGULAR : FontFamily.MERRIWATHER_BOLD,
              fontStyle: 'normal',
             },
            em: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_20 : FontSize.SIZE_16
              ),
              color: Color.TEXTCOLOR,
              fontFamily: Platform.OS === 'ios' ? FontFamily.MERRIWATHER_ITALIC : FontFamily.MERRIWATHER_BOLD_ITALIC,
              fontStyle: 'normal',
             },
            strong: {
              fontSize: getFontSize(
                item.ProgressValue,
                isTablet ? FontSize.SIZE_20 : FontSize.SIZE_16
              ),
              color: Color.TEXTCOLOR,
              fontFamily: FontFamily.MERRIWATHER_BOLD,
              fontStyle: 'normal',
            },
          }}
          systemFonts={[
            FontFamily.MERRIWATHER_REGULAR,
            FontFamily.MERRIWATHER_ITALIC,
            FontFamily.MERRIWATHER_BOLD,
            FontFamily.MERRIWATHER_BOLD_ITALIC,
          ]}
        />

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* Single Image    :- Image */}
          <>
            {isVideo && videoUrl ? (
              isYouTube ? (
                <YoutubePlayer
                  height={isTablet ? 500 : 200}
                  width={width - (isTablet ? 35 : 25)}
                  videoId={videoUrl.split("v=")[1]}
                  play={false}
                />
              ) : (
                <VideoPlayer
                  video={{ uri: videoUrl }}
                  autoplay={false}
                  controls={true}
                  videoWidth={width - (isTablet ? 35 : 25)}
                  videoHeight={isTablet ? 500 : 200}
                />
              )
            ) : (
              <ImageWithCaption
                imagePaths={imagePaths}
                imageMore={imageMore}
                handlePressMoreImage={handlePressMoreImage}
                item={item}
                handleImageClick={handleImageClick}
              />
            )}
          </>
        </View>

        {/*  Data    :- MainText */}
        <CustomRenderHtmlDetails
          htmlContent={item.Issue.MainText[0]}
          job={false}
          tagsStyles={{
            p: {
              fontSize: getFontSize(item.ProgressValue, FontSize.SIZE_16),
              color: Color.TEXTCOLOR70,
              fontFamily: FontFamily.LIBRE_FRANKLIN_REGULAR,
              letterSpacing: 0.5,
              lineHeight: 24,
              fontStyle: 'normal',
            },
            div: {
              fontSize: getFontSize(item.ProgressValue, FontSize.SIZE_16),
              color: Color.TEXTCOLOR70,
              fontFamily: FontFamily.LIBRE_FRANKLIN_REGULAR,
              letterSpacing: 0.5,
              lineHeight: 24,
              fontStyle: 'normal', },
            em: {
              fontSize: getFontSize(item.ProgressValue, FontSize.SIZE_14),
              color: Color.TEXTCOLOR70,
              fontFamily: FontFamily.LIBRE_FRANKLIN_ITALIC,
              letterSpacing: 0.5,
              lineHeight: 24,
              fontStyle: 'italic', },
            strong: {
              fontSize: getFontSize(item.ProgressValue, FontSize.SIZE_14),
              color: Color.TEXTCOLOR70,
              fontFamily: FontFamily.LIBRE_FRANKLIN_Bold,
              letterSpacing: 0.5,
              lineHeight: 24,
              fontStyle: 'normal', },
            li: {
              fontSize: getFontSize(item.ProgressValue, FontSize.SIZE_14),
              color: Color.TEXTCOLOR70,
              fontFamily: FontFamily.LIBRE_FRANKLIN_REGULAR,
              letterSpacing: 0.5,
              lineHeight: 24,
              marginBottom: 10,
              paddingLeft: 10,
              fontStyle: 'normal',},
          }}
          systemFonts={[
            FontFamily.LIBRE_FRANKLIN_REGULAR,
            FontFamily.LIBRE_FRANKLIN_ITALIC,
            FontFamily.LIBRE_FRANKLIN_Bold,
          ]}
        />
      </View>
    </View>
  );
};

export default ArticleDetails;
