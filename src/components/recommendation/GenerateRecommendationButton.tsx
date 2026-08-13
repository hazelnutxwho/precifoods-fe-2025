import { Button } from "@mui/material";

import useGenerateRecommendation from "@/hooks/useGenerateRecommendation";

export function GenerateRecommendationButton({
  onGenerated,
}: {
  onGenerated?: () => void;
}) {
  const { isGenerating, generateRecommendation } =
    useGenerateRecommendation(onGenerated);

  return (
    <Button
      className="rounded-3xl"
      size="small"
      variant="contained"
      disabled={isGenerating}
      onClick={generateRecommendation}
    >
      {isGenerating ? "Membuat Rekomendasi..." : "Rekomendasi Baru"}
    </Button>
  );
}
