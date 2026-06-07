export function LinkExpired() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#fffbf5" }}
    >
      <div className="max-w-md mx-auto px-4 text-center">
        <div
          className="bg-white rounded-2xl shadow-sm border p-10"
          style={{ borderColor: "#e7e5e4" }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#fff7ed" }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: "#f97316" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1c1917" }}>
            Payment Link Expired
          </h2>
          <p className="text-sm mb-8" style={{ color: "#78716c" }}>
            This payment link is only valid for 15 minutes. Payment links expire
            for your security. Please request a new booking to continue.
          </p>

          {/* Divider with icon */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "#e7e5e4" }}
            />
            <svg
              className="w-4 h-4"
              style={{ color: "#a8a29e" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "#e7e5e4" }}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
