export default function CurrentPlan() {
  return (
    <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 dark:from-rose-900 dark:via-purple-900 dark:to-blue-900 rounded-xl p-6 mb-8">
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">CURRENT PLAN</div>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Researcher</h2>
          <div>
            <div className="text-sm mb-2">API Limit</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="text-sm mt-1">0/1,000 Requests</div>
          </div>
        </div>
        <button className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg text-sm">
          Manage Plan
        </button>
      </div>
    </div>
  );
} 