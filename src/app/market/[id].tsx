import { useEffect, useState, useRef } from "react";
import { Alert, Modal, StatusBar, View, ScrollView } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { IconScan } from "@tabler/icons-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

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
  const [coupon, setCoupon] = useState("");
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [isFecthingCoupon, setIsFecthingCoupon] = useState(false);

  const [_, requestPermission] = useCameraPermissions();
  const params = useLocalSearchParams<{ id: string }>();

  const qrLock = useRef(false);
  console.log(params.id);

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

  async function handleCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }

      setIsVisibleCameraModal(!isVisibleCameraModal);
      qrLock.current = false;
    } catch (error) {
      console.log(error);
      Alert.alert("Câmera", "Não foi possível utilizar a câmera.");
    }
  }

  async function getCoupon(id: string) {
    try {
      setIsFecthingCoupon(true);

      const { data } = await api.patch(`/coupons/${id}`);

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível utilizar o cupom.");
    } finally {
      setIsFecthingCoupon(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realemte resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={data.cover} />
        <Details data={data} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleCamera}>
          <Button.Icon icon={IconScan} />
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <StatusBar hidden />
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => handleUseCoupon(data), 500);
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button onPress={handleCamera} isLoading={isFecthingCoupon}>
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
