import { ArrowLeft, MapPin, Search, X } from "lucide-react";

export default function MapHeader({
  isSearchMode,
  keyword,
  searchResults,
  onBack,
  onSearchOpen,
  onSearchChange,
  onSearchClose,
  onSearchSubmit,
  onPlaceSelect,
}) {
  return (
    <header
      className="
        absolute
        top-0
        left-0
        z-40
        w-full
        px-5
        pt-[calc(20px+env(safe-area-inset-top))]
      "
    >
      {/* ====================
          기본 Map Header
      ==================== */}

      {!isSearchMode && (
        <div className="flex items-center justify-between">
          {/* 뒤로가기 */}

          <button
            type="button"
            onClick={onBack}
            className="
              click-scale-sm
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-full
              border
              border-[#D9D9D9]
              bg-white
            "
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>

          {/* 검색 */}

          <button
            type="button"
            onClick={onSearchOpen}
            className="
              click-scale-sm
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-full
              border
              border-[#D9D9D9]
              bg-white
            "
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* ====================
          검색 Mode
      ==================== */}

      {isSearchMode && (
        <div className="relative flex items-start gap-[10px]">
          {/* 뒤로가기 */}

          <button
            type="button"
            onClick={onBack}
            className="
              click-scale-sm
              flex
              h-[40px]
              w-[40px]
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#D9D9D9]
              bg-white
            "
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>

          <div className="relative flex-1">
            {/* 검색창 */}

            <form
              onSubmit={onSearchSubmit}
              className="
                flex
                h-[40px]
                w-full
                items-center
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
                px-[12px]
              "
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className="shrink-0 text-[#555555]"
              />

              <input
                type="text"
                value={keyword}
                onChange={onSearchChange}
                placeholder="장소를 검색해보세요."
                autoFocus
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-[8px]
                  text-[14px]
                  leading-[20px]
                  outline-none
                  placeholder:text-[#888888]
                "
              />

              {/* 검색 닫기 */}

              <button
                type="button"
                onClick={onSearchClose}
                className="
                  click-scale-sm
                  flex
                  h-[28px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#555555]
                "
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </form>

            {/* ====================
                검색 결과
            ==================== */}

            {searchResults.length > 0 && (
              <div
                className="
                  absolute
                  top-[48px]
                  left-0
                  z-50
                  w-full
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                "
              >
                {searchResults.map((prediction) => (
                  <button
                    key={prediction.placeId}
                    type="button"
                    onClick={() => onPlaceSelect(prediction)}
                    className="
                      click-scale
                      flex
                      w-full
                      items-start
                      gap-[10px]
                      border-b
                      border-[#EEEEEE]
                      px-[12px]
                      py-[12px]
                      text-left
                      last:border-b-0
                    "
                  >
                    <MapPin
                      size={17}
                      strokeWidth={1.5}
                      className="mt-[2px] shrink-0 text-[#555555]"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium leading-[20px]">
                        {prediction.mainText?.toString() ||
                          prediction.text?.toString()}
                      </p>

                      {prediction.secondaryText && (
                        <p className="mt-[2px] truncate text-[12px] leading-[18px] text-[#888888]">
                          {prediction.secondaryText.toString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
