import { BedDouble, Plus, X } from "lucide-react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);

  return `${month}/${day}`;
};

export default function ScheduleAccommodation({
  accommodations,
  onAdd,
  onDelete,
}) {
  return (
    <div className="mt-[12px]">
      {accommodations.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="
            click-scale
            flex
            h-[38px]
            w-full
            items-center
            gap-[8px]
            rounded-lg
            bg-[#F5F5F5]
            px-[10px]
            text-[12px]
            text-[#888888]
          "
        >
          <BedDouble size={16} strokeWidth={1.5} />

          <span>숙소</span>
        </button>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              className="
                  flex
                  items-center
                  gap-[10px]
                  rounded-xl
                  border
                  border-[#D9D9D9]
                  bg-white
                  p-[10px]
                "
            >
              <div
                className="
                    h-[54px]
                    w-[54px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-[#D9D9D9]
                  "
              >
                {accommodation.imageUrl && (
                  <img
                    src={accommodation.imageUrl}
                    alt={accommodation.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold leading-[20px]">
                  {accommodation.name}
                </p>

                <p className="mt-[3px] text-[11px] leading-[16px] text-[#555555]">
                  {formatDate(accommodation.checkInDate)}{" "}
                  {accommodation.checkInTime}
                  {" ~ "}
                  {formatDate(accommodation.checkOutDate)}{" "}
                  {accommodation.checkOutTime}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDelete(accommodation.id)}
                className="
                    click-scale-sm
                    flex
                    h-[28px]
                    w-[28px]
                    items-center
                    justify-center
                    text-[#888888]
                  "
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          ))}

          {accommodations.length < 2 && (
            <button
              type="button"
              onClick={onAdd}
              className="
                click-scale
                flex
                h-[36px]
                w-full
                items-center
                justify-center
                gap-[6px]
                rounded-lg
                bg-[#F5F5F5]
                text-[12px]
                text-[#888888]
              "
            >
              <Plus size={15} strokeWidth={1.5} />
              숙소 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}
