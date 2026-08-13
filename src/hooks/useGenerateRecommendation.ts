import { useCallback, useEffect, useRef, useState } from "react";

import { openToast } from "@/components/Toast";
import { GET_RECOMMENDATIONS } from "@/constants/endpoint";
import { IndexRecommendation } from "@/interfaces/menu";
import { getDataAuthenticated, postDataAuthenticated } from "@/utils/http";

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ATTEMPTS = 20;

export default function useGenerateRecommendation(onGenerated?: () => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  const clearPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    attemptsRef.current = 0;
  }, []);

  useEffect(() => clearPolling, [clearPolling]);

  const generateRecommendation = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      await postDataAuthenticated(GET_RECOMMENDATIONS());

      onGenerated?.();

      pollTimerRef.current = setInterval(async () => {
        attemptsRef.current += 1;

        let data: IndexRecommendation | null = null;
        try {
          data = (await getDataAuthenticated(
            GET_RECOMMENDATIONS(),
          )) as IndexRecommendation;
        } catch (error: unknown) {
          clearPolling();
          setIsGenerating(false);
          if (error instanceof Error) console.error(error.message);
          return;
        }

        onGenerated?.();

        if (!data?.status?.is_generating) {
          clearPolling();
          setIsGenerating(false);

          if (data?.status?.generator_error) {
            openToast({
              type: "error",
              message: `Proses rekomendasi gagal: ${data.status.generator_error}`,
            });
          } else {
            openToast({
              type: "success",
              message: "Rekomendasi berhasil dibuat!",
            });
          }
          return;
        }

        if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
          clearPolling();
          setIsGenerating(false);
          openToast({
            type: "info",
            message:
              "Rekomendasi masih diproses. Silakan periksa kembali beberapa saat lagi.",
          });
        }
      }, POLL_INTERVAL_MS);
    } catch (error: unknown) {
      setIsGenerating(false);
      if (error instanceof Error) {
        console.error(error.message);
        openToast({ type: "error", message: error.message });
      }
    }
  }, [isGenerating, clearPolling, onGenerated]);

  return { isGenerating, generateRecommendation };
}
