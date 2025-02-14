import React, {useCallback, useEffect, useState} from "react";
import ImageComponent from "./ImageComponent";
import { IMainTabProps } from "@/navigation/interfaces";
import { URL_COMMON } from "@/utils/constants";
import { useRoute } from "@react-navigation/native";
import { getImagePathsWithCaptions } from "@/hooks/getAllData";
import { Share } from "react-native";




const ImageContainer = ({ navigation }: IMainTabProps) => {

  const route = useRoute();
  const { item , issueID , isSingle} = route.params as any;
  const [imagePaths, setImagePaths] = useState([]);
  const [caption, setCaption] = useState([]);
  const [shareUrl, setShareUrl] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const galleryImagesString = item.GalleryImages[0]?.string;
      
        const ImageID = item.Image;
        const imageIdArray = Array.isArray(ImageID) ? ImageID : [ImageID];

         const imagesArray = galleryImagesString ? [galleryImagesString] : [];
         const combinedImages = [...imageIdArray, ...imagesArray].flat();

        const fetchedImagePaths = await getImagePathsWithCaptions(combinedImages, isSingle ,issueID );
        setImagePaths(fetchedImagePaths);
        const captions = fetchedImagePaths.map(image => image.caption);
        setCaption(captions)

        

        setShareUrl(item.Url[0])

      } catch (error) {
        console.error("Error fetching image path:", error);
      }
    };

    fetchData();
  }, [item]);


 
  const onShare = useCallback(async () => {
    try {
      //console.log("Shared:-image",shareUrl);

      const url = (shareUrl === "#" || shareUrl.trim() === "") ? URL_COMMON : URL_COMMON + shareUrl;

      await Share.share({
        message: `${url}`,
      });

    } catch (error: any) {
    }
  }, [shareUrl]);
  
  const handlePressBack = () => {
   
    navigation.goBack()
  };

  const handleImageClick = (item: any) => {
    navigation.navigate("CoverScreen", {
      item:item,
      isCover: false,
    });
  };


  return (
    <ImageComponent
    shareUrl={shareUrl}
    imagePaths={imagePaths}
    caption={caption}
      handlePressBack={handlePressBack}
      handleImageClick={handleImageClick}
      handlePressShare={onShare}
    />
  );
};

export default ImageContainer;
