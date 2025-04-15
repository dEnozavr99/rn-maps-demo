import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Maps Demo",
  slug: "maps-demo",
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY || "",
      },
    },
  },
});
