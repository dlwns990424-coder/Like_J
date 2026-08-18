import SchedulePlaceCard from "./SchedulePlaceCard";

export default function ScheduleTimeline({
  schedules,
  isEditMode,
  selectedScheduleIds,
  onSelectSchedule,
  onTimeSave,
  onMemoSave,
}) {
  if (schedules.length === 0) {
    return null;
  }

  return (
    <div className="mt-[16px]">
      {schedules.map((schedule, index) => (
        <div key={schedule.id} className="relative flex gap-[10px]">
          <div className="relative flex w-[18px] shrink-0 justify-center">
            {index < schedules.length - 1 && (
              <div
                className="
                  absolute
                  top-[18px]
                  bottom-[-18px]
                  left-1/2
                  w-px
                  -translate-x-1/2
                  bg-[#D9D9D9]
                "
              />
            )}

            <div
              className="
                relative
                z-10
                mt-[18px]
                flex
                h-[16px]
                w-[16px]
                items-center
                justify-center
                rounded-full
                bg-[#3478F6]
                text-[9px]
                font-semibold
                text-white
              "
            >
              {index + 1}
            </div>
          </div>

          <div className="min-w-0 flex-1 pb-[18px]">
            <SchedulePlaceCard
              schedule={schedule}
              onTimeSave={onTimeSave}
              onMemoSave={onMemoSave}
              isEditMode={isEditMode}
              isSelected={selectedScheduleIds.includes(schedule.id)}
              onSelect={() => onSelectSchedule(schedule.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
