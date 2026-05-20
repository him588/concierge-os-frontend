import Image from "next/image";
import { useLatestBookings } from "./hooks/hooks";
import { LatestBookings } from "./types/types";
import { useRouter } from "next/navigation";

const statusStyles: Record<string, string> = {
  confirmed: "bg-purple-100 text-purple-600",
  pending: "bg-orange-100 text-orange-600",
};

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent soft color based on name
  const colors = [
    "bg-purple-200 text-purple-700",
    "bg-blue-200 text-blue-700",
    "bg-pink-200 text-pink-700",
    "bg-green-200 text-green-700",
    "bg-orange-200 text-orange-700",
    "bg-teal-200 text-teal-700",
  ];
  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${colors[colorIndex]}`}
    >
      {initials}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-2 w-12 bg-gray-100 rounded" />
        <div className="h-4 w-14 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function BookingListCard() {
  const { data: bookings, isLoading, isError } = useLatestBookings();
  const router = useRouter();

  const latestBookings: LatestBookings[] = (
    bookings?.data?.latestBookings || []
  ).slice(0, 3);

  return (
    <div className="w-full relative h-full bg-white rounded-2xl p-2 shadow-sm overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-[160px]">
        <Image
          src="https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="cover"
          fill
          className="object-cover rounded-[1rem]"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">Booking list</p>
        <span
          onClick={() => router.push("/earnings")}
          className="cursor-pointer text-[10px] font-light text-gray-500"
        >
          •••
        </span>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : isError ? (
          <p className="text-xs text-center text-red-400 py-2">
            Failed to load bookings.
          </p>
        ) : latestBookings.length === 0 ? (
          <p className="text-xs text-center text-gray-400 py-2">
            No bookings found.
          </p>
        ) : (
          latestBookings.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-3">
                <AvatarInitials name={item.name} />
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    #{item.roomType.toUpperCase().slice(0, 3)} · {item.guests}{" "}
                    guests
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-[10px] text-gray-400">{item.date}</p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    statusStyles[item.bookingStatus]
                  }`}
                >
                  {item.bookingStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        onClick={() => router.push("/earnings")}
        className=" absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center"
      >
        <span className="text-sm  text-center text-[#ffa500] cursor-pointer hover:underline">
          View all
        </span>
      </div>
    </div>
  );
}
