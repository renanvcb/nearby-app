import { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import { api } from "@/services/api";

import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

// type MarketProps = PlaceProps
interface MarketProps extends PlaceProps {}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketProps[]>([]);

  const ref = useRef<MapView>(null);

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setCategory(data[0].id);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Categorias",
        "Não foi possível carregar as categorias. Tente novamente mais tarde!"
      );
    }
  }

  async function fetchPlaces() {
    try {
      if (!category) {
        return;
      }
      const { data } = await api.get("/markets/category/" + category);
      setMarkets(data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Não foi possivel carregar os locais. Tente novamente mais tarde!"
      );
    }
  }

  // Gets the actual device location
  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (granted) {
        const location = await Location.getCurrentPositionAsync();
        console.log("Location", location);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // getCurrentLocation();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  useEffect(() => {
    if (ref.current) {
      ref.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        zoom: 15,
      });
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      <MapView style={{ flex: 1 }} ref={ref} />

      <Places data={markets} />
    </View>
  );
}
