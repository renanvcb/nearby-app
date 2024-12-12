import { Pressable, PressableProps, Text } from "react-native";

import { s } from "./styles";
import { colors } from "@/styles/theme";
import { categoriesIcons } from "@/utils/categories-icons";

interface CategoryProps extends PressableProps {
  name: string;
  iconId: string;
  isSelected?: boolean;
}

export function Category({
  iconId,
  isSelected = false,
  name,
  ...rest
}: CategoryProps) {
  const Icon = categoriesIcons[iconId];

  return (
    <Pressable
      style={[s.container, isSelected && s.containerSelected]}
      {...rest}
    >
      <Icon size={16} color={colors.gray[isSelected ? 100 : 400]} />
      <Text style={[s.name, isSelected && s.nameSelected]}>{name}</Text>
    </Pressable>
  );
}
