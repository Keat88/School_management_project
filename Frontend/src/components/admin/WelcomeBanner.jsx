function WelcomeBanner({ name }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Welcome back, {name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{today}</p>
      </div>
      <div className="hidden sm:flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center">
        <span className="text-blue-600 text-lg font-semibold">
          {name?.charAt(0) || "A"}
        </span>
      </div>
    </div>
  );
}

export default WelcomeBanner;