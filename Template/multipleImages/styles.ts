import { Color, FontFamily, FontSize } from "@/constants/theme";
import { StyleSheet } from "react-native";
import { isTablet } from "@/utils/constants";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BACKGROUNDGRAY,
  },
  
  header: {
    marginHorizontal: isTablet ? 34:  24,
    marginTop: isTablet ? 20 : 0,
    height: isTablet ? 48 : 65 ,
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "space-between"
  },

  backButton: {
    marginBottom: 20,
  },

  backButtonText:{fontSize : FontSize.SIZE_24},

  shareButtonText:{fontSize : FontSize.SIZE_24},



  
 
});
