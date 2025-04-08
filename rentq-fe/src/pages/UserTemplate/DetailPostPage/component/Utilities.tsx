import { useEffect, useState } from "react";
import utilitiesData from "./../../../../data/utilities_data.json";
import * as Icons from "react-icons/fi";
import { Modal, Button } from "antd";

interface UtilitiesListProps {
  utilitiesArray?: string[];
}

const UtilitiesList: React.FC<UtilitiesListProps> = ({
  utilitiesArray = [],
}) => {
  const [utilities, setUtilities] = useState<{ name: string; icon: string }[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!utilitiesArray) return;

    const sortedUtilities = [...utilitiesData].sort((a, b) => {
      const isAAvailable =
        Array.isArray(utilitiesArray) && utilitiesArray.includes(a.name);
      const isBAvailable =
        Array.isArray(utilitiesArray) && utilitiesArray.includes(b.name);
      return Number(isBAvailable) - Number(isAAvailable);
    });

    setUtilities(sortedUtilities);
  }, [utilitiesArray]);

  const visibleUtilities = utilities.slice(0, 9);
  const remainingUtilities = utilities.slice(9);

  return (
    <div className="lg:w-4/5 w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-5">
        {visibleUtilities.map((utility, index) => {
          const IconComponent =
            Icons[utility.icon as keyof typeof Icons] || Icons.FiHelpCircle;
          const isAvailable =
            Array.isArray(utilitiesArray) &&
            utilitiesArray.includes(utility.name);

          return (
            <div
              key={index}
              className={`flex items-center space-x-2 text-gray-700 ${
                isAvailable ? "" : "line-through text-gray-400"
              }`}
            >
              <IconComponent
                className={`text-lg ${
                  isAvailable ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <span>{utility.name}</span>
            </div>
          );
        })}
      </div>

      {remainingUtilities.length > 0 && (
        <div className="text-left mt-2">
          <Button className="p-4" onClick={() => setIsModalOpen(true)}>
            View more
          </Button>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="space-y-4">

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Supported Utilities
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {utilities.map((utility, index) => {
                const IconComponent =
                  Icons[utility.icon as keyof typeof Icons] ||
                  Icons.FiHelpCircle;
                const isAvailable =
                  Array.isArray(utilitiesArray) &&
                  utilitiesArray.includes(utility.name);

                return isAvailable ? (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <IconComponent className="text-lg text-blue-500" />
                    <span>{utility.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Not Supported Utilities
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {utilities.map((utility, index) => {
                const IconComponent =
                  Icons[utility.icon as keyof typeof Icons] ||
                  Icons.FiHelpCircle;
                const isAvailable =
                  Array.isArray(utilitiesArray) &&
                  utilitiesArray.includes(utility.name);

                return !isAvailable ? (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-400 line-through"
                  >
                    <IconComponent className="text-lg text-gray-400" />
                    <span>{utility.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UtilitiesList;
