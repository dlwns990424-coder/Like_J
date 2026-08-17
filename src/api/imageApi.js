const KAKAO_IMAGE_SEARCH_URL = "https://dapi.kakao.com/v2/search/image";

// ====================
// Kakao REST API Key
// ====================

const getKakaoRestApiKey = () => {
  return import.meta.env.VITE_KAKAO_REST_API_KEY;
};

// ====================
// Kakao Image Search
// ====================

const searchKakaoImages = async (query) => {
  const restApiKey = getKakaoRestApiKey();

  if (!restApiKey) {
    throw new Error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
  }

  const params = new URLSearchParams({
    query,
    sort: "accuracy",
    page: "1",
    size: "30",
  });

  const response = await fetch(
    `${KAKAO_IMAGE_SEARCH_URL}?${params.toString()}`,
    {
      method: "GET",

      headers: {
        Authorization: `KakaoAK ${restApiKey}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Kakao 이미지 검색 오류:", response.status, errorText);

    throw new Error(`Kakao 이미지 검색 실패: ${response.status}`);
  }

  const data = await response.json();

  return data.documents || [];
};

// ====================
// 이미지 선택
// ====================

const selectBestImage = (images) => {
  if (!images.length) {
    return null;
  }

  // ====================
  // 너무 작은 이미지 제외
  // ====================

  const usableImages = images.filter((image) => {
    const width = Number(image.width);

    const height = Number(image.height);

    return width >= 500 && height >= 250;
  });

  // ====================
  // 가로 이미지 우선
  // ====================

  const landscapeImages = usableImages.filter((image) => {
    const width = Number(image.width);

    const height = Number(image.height);

    return width > height;
  });

  if (landscapeImages.length > 0) {
    return landscapeImages[0];
  }

  if (usableImages.length > 0) {
    return usableImages[0];
  }

  return images[0];
};

// ====================
// Destination Image
// ====================

export const getDestinationImage = async ({ name, country, type }) => {
  if (!name) {
    return null;
  }

  // ====================
  // 검색어 후보
  // ====================

  const queries =
    type === "country"
      ? [`${name} 여행`, `${name} 관광`, `${name} 풍경`, name]
      : [
          `${name} 여행`,
          `${name} 관광`,
          `${name} ${country}`,
          `${name} 풍경`,
          name,
        ];

  // ====================
  // 검색어 순서대로 시도
  // ====================

  for (const query of queries) {
    try {
      const images = await searchKakaoImages(query);

      const image = selectBestImage(images);

      if (!image) {
        continue;
      }

      return {
        imageUrl: image.image_url || image.thumbnail_url || "",

        imageThumbUrl: image.thumbnail_url || image.image_url || "",

        imageSourceUrl: image.doc_url || "",

        imageDisplayName: image.display_sitename || "",

        imageWidth: Number(image.width) || null,

        imageHeight: Number(image.height) || null,
      };
    } catch (error) {
      console.error(`이미지 검색 실패: ${query}`, error);
    }
  }

  return null;
};
