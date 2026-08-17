import { ArrowLeft, MapPin, Search, X } from "lucide-react";

export default function MapHeader({
  isSearchMode,
  keyword,
  searchResults = [],
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
          기본 Header
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
        <>
          <div className="flex items-center gap-[10px]">
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

            {/* 검색 Form */}

            <form
              onSubmit={onSearchSubmit}
              className="
                flex
                h-[40px]
                min-w-0
                flex-1
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
                className="
                  shrink-0
                  text-[#555555]
                "
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
          </div>

          {/* ====================
              검색 결과
          ==================== */}

          {searchResults.length > 0 && (
            <div
              className="
                mt-[10px]
                max-h-[320px]
                overflow-y-auto
                rounded-xl
                border
                border-[#D9D9D9]
                bg-white
              "
            >
              {searchResults.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onPlaceSelect(place)}
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
                    size={18}
                    strokeWidth={1.5}
                    className="
                      mt-[2px]
                      shrink-0
                      text-[#555555]
                    "
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[14px]
                        font-semibold
                        leading-[20px]
                      "
                    >
                      {place.name}
                    </p>

                    {place.category && (
                      <p
                        className="
                          mt-[2px]
                          truncate
                          text-[11px]
                          leading-[16px]
                          text-[#555555]
                        "
                      >
                        {place.category}
                      </p>
                    )}

                    {place.address && (
                      <p
                        className="
                          mt-[2px]
                          truncate
                          text-[11px]
                          leading-[16px]
                          text-[#888888]
                        "
                      >
                        {place.address}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </header>
  );
}
