import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { api } from "@/services/api";

import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

// type MarketProps = PlaceProps
interface MarketProps extends PlaceProps {}

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketProps[]>([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      <Places data={markets} />
    </View>
  );
}
