export default function ApiKeysTable({ 
  apiKeys, 
  onToggleVisibility, 
  onEdit, 
  onCopy, 
  onDelete 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <th className="pb-3">NAME</th>
            <th className="pb-3">USAGE</th>
            <th className="pb-3">KEY</th>
            <th className="pb-3">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-b dark:border-gray-700">
              <td className="py-4">{key.name}</td>
              <td className="py-4">{key.usage}</td>
              <td className="py-4 font-mono">
                {key.is_visible ? key.key : '********************************'}
              </td>
              <td className="py-4">
                <div className="flex gap-3">
                  <button 
                    onClick={() => onToggleVisibility(key.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">
                      {key.is_visible ? 'Hide' : 'Show'}
                    </span>
                    {key.is_visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button 
                    onClick={() => onEdit(key)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Edit</span>
                    ✏️
                  </button>
                  <button 
                    onClick={() => onCopy(key.key)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Copy</span>
                    📋
                  </button>
                  <button 
                    onClick={() => onDelete(key.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Delete</span>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 