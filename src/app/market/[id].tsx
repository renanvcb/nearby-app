import { useEffect, useState } from "react";
import { Alert, Modal, View } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { IconScan } from "@tabler/icons-react-native";

import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

import { api } from "@/services/api";

interface DataProps extends PropsDetails {
  cover: string;
}

export default function Market() {
  const [data, setData] = useState<DataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

  const params = useLocalSearchParams<{ id: string }>();

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar as informações do local.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }

  function handleCamera() {
    try {
      setIsVisibleCameraModal(!isVisibleCameraModal);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Cover uri={data.cover} />
      <Details data={data} />
      {data.coupons > 0 && <Coupon code="FM345T6" />}
      <View style={{ padding: 32 }}>
        <Button onPress={handleCamera}>
          <Button.Icon icon={IconScan} />
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <Button onPress={handleCamera}>
          <Button.Title>Voltar</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
