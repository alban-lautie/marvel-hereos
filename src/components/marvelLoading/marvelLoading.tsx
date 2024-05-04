import { useQuery } from "@tanstack/react-query";
import { type LottieComponentProps } from "lottie-react";
import { Suspense, lazy, FC } from "react";

export const MarvelLoading: FC = () => {
  return (
    <div className="h-[400px] w-[400px]">
      <LazyLottie
        getJson={() => import("./spierman-animation.json")}
        loop
        id="empty-box"
        width={400}
        height={400}
      />
    </div>
  );
};

const LazyLottieComponent = lazy(() => import("lottie-react"));

interface LottieProps<T extends Record<string, unknown>> {
  getJson: () => Promise<T>;
  id: string;
}

export function LazyLottie<T extends Record<string, unknown>>({
  getJson,
  id,
  ref,
  ...props
}: LottieProps<T> & Omit<LottieComponentProps, "animationData">) {
  const { data } = useQuery({
    queryKey: [id],
    queryFn: getJson,
    enabled: typeof window !== "undefined",
  });

  if (!data) return null;

  return (
    <Suspense fallback={null}>
      <LazyLottieComponent animationData={data} {...props} />
    </Suspense>
  );
}
