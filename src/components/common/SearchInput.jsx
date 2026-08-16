import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex h-[52px] w-full items-center gap-[10px] rounded-xl border border-transparent bg-[#F5F5F5] px-[10px] focus-within:border-[#888888]"
    >
      <button
        type="submit"
        className="flex shrink-0 items-center justify-center text-[#888888]"
      >
        <Search size={20} strokeWidth={1.5} />
      </button>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-[16px] leading-[24px] outline-none placeholder:text-[#888888]"
      />
    </form>
  );
}
