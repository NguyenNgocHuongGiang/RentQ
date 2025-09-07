import { FaHome } from "react-icons/fa";

interface Host {
  id: number;
  name: string;
  avatar?: string;
  totalPosts: number;
}

export const PopularHostsSidebar: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Chủ nhà uy tín khác
      </h3>
      <div className="space-y-4">
        {hosts.map((host) => (
          <div key={host.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {host.avatar ? (
                <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <FaHome className="text-gray-400 text-lg" />
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-800 font-medium">{host.name}</p>
              <p className="text-gray-500 text-sm">{host.totalPosts} bài cho thuê</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
