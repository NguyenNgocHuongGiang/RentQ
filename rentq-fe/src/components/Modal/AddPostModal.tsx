import { useFormik } from "formik";
import { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { getAuthData } from "../../utils/helpers";
import utilitiesData from "../../data/utilities_data.json";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createListingImage, createNewPost, uploadImages } from "../../store/slice/postSlice";

export interface ImageFile {
  id: string;
  file: File;
  name: string;
}

export default function AddPostModal({
  setIsOpenAdd,
  onPostCreated,
}: {
  setIsOpenAdd: (open: boolean) => void;
  onPostCreated: (data: any) => void;
}) {
  const utilitiesList = utilitiesData.map((item) => item.name)

  const dispatch = useDispatch<AppDispatch>();

  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [step, setStep] = useState(1);
  const [newPost, setNewPost] = useState<any>({});

  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const user = getAuthData();

  const formik = useFormik({
    initialValues: {
      landlordId: user.userId,
      title: "",
      address: "",
      area: 0,
      price: 0,
      maxPeople: 0,
      utilities: [] as string[],
      furniture: "full",
      availableFrom: "",
      propertyType: "apartment",
      description: "",
    },
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        availableFrom: new Date(values.availableFrom),
        description: values.description.replace(/\n/g, "\\n"),
      };
      setNewPost(formattedValues);
      setStep(2);
    },
  });

  const convertToFileList = (files: ImageFile[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((imageFile) => dataTransfer.items.add(imageFile.file));
    return dataTransfer.files;
  };

  const handlePost = async () => {
    const data = await dispatch(createNewPost(newPost)).unwrap();
    const uploadedImages = await dispatch(
      uploadImages(convertToFileList(images))
    ).unwrap();
    await dispatch(
      createListingImage({
        listing_id: data.listing_id!,
        images_url: uploadedImages,
        isMain: [true, false],
      })
    );
    setIsOpenAdd(false);
    if (data) {
      onPostCreated(data);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImages = filesArray.map((file) => ({
        id: URL.createObjectURL(file),
        file,
        name: file.name,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    if (mainImage === id) {
      setMainImage(null);
    }
  };

  const toggleUtility = (utility: string) => {
    setSelectedUtilities((prev) => {
      const newUtilities = prev.includes(utility)
        ? prev.filter((item) => item !== utility)
        : [...prev, utility];
      const utilitiesString = newUtilities.join(";");
      formik.setFieldValue("utilities", utilitiesString);
      return newUtilities;
    });
  };

  const filteredUtilities = utilitiesList.filter((utility) =>
    utility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="z-50 text-left fixed inset-0 flex items-center justify-center bg-amber-50/5 backdrop-blur-sm text-[#483507]">
      <div className="lg:w-1/2 md:w-screen max-h-150 overflow-y-auto text-md bg-white p-6 rounded-lg shadow-2xl shadow-black/50 transform transition-all scale-95 animate-fade-in">
        {/* Step 1 */}
        {step == 1 && (
          <>
            <h2 className="pl-4 text-2xl font-semibold">Add new post</h2>
            <form className="p-4" onSubmit={formik.handleSubmit}>
              {/* Title */}
              <div className="mt-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Title post
                </label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  name="title"
                  type="text"
                  id="title"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Address */}
              <div className="mt-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2"
                >
                  Address
                </label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  name="address"
                  type="text"
                  id="address"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Area & Price on the same row */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium mb-2"
                  >
                    Area (m²)
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.area}
                    name="area"
                    type="number"
                    id="area"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    Price (VND)
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.price}
                    name="price"
                    type="number"
                    id="price"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Max People */}
                <div>
                  <label
                    htmlFor="maxPeople"
                    className="block text-sm font-medium mb-2"
                  >
                    Max people
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.maxPeople}
                    name="maxPeople"
                    type="number"
                    id="maxPeople"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Utilities */}
              <div className="my-4">
                <label className="block text-sm font-medium mb-2">
                  Utilities
                </label>

                <div className="border rounded-lg p-2 flex flex-wrap items-center gap-2 border-gray-300">
                  {selectedUtilities.map((utility) => (
                    <div
                      key={utility}
                      className="px-3 py-1 rounded-full bg-[#483507] text-white text-sm flex items-center gap-1 cursor-pointer"
                      onClick={() => toggleUtility(utility)}
                    >
                      {utility}
                      <span className="text-white text-lg font-bold leading-none">
                        ×
                      </span>
                    </div>
                  ))}

                  {/* Ô Input để nhập và tìm kiếm */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border-0 outline-none focus:ring-0 focus:border-transparent p-2"
                  />
                </div>

                {/* Danh sách utilities để chọn */}
                {searchTerm && (
                  <div className="border rounded-lg p-2 mt-2 max-h-40 overflow-y-auto">
                    {filteredUtilities.length > 0 ? (
                      filteredUtilities.map((utility) => (
                        <div
                          key={utility}
                          onClick={() => {
                            toggleUtility(utility);
                            setSearchTerm("");
                          }}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {utility}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm p-2">
                        Không tìm thấy utilities
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Furniture, Available From & Property Type on the same row */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Furniture */}
                <div>
                  <label
                    htmlFor="furniture"
                    className="block text-sm font-medium mb-2"
                  >
                    Furniture
                  </label>
                  <select
                    onChange={formik.handleChange}
                    value={formik.values.furniture}
                    name="furniture"
                    id="furniture"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="full">Full</option>
                    <option value="basic">Basic</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {/* Available From */}
                <div>
                  <label
                    htmlFor="availableFrom"
                    className="block text-sm font-medium mb-2"
                  >
                    Available From
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.availableFrom}
                    name="availableFrom"
                    type="date"
                    id="availableFrom"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label
                    htmlFor="propertyType"
                    className="block text-sm font-medium mb-2"
                  >
                    Property Type
                  </label>
                  <select
                    onChange={formik.handleChange}
                    value={formik.values.propertyType}
                    name="propertyType"
                    id="propertyType"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  name="description"
                  id="description"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setIsOpenAdd(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#483507] text-white rounded-lg hover:bg-[#483507] hover:cursor-pointer"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="p-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-4"
            />
            {images.length > 5 && (
              <h4 className="text-red-500 mb-4">No more than 5 images</h4>
            )}

            {images.length > 0 && (
              <div>
                <table className="w-full border-collapse border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Image</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Choose main</th>
                      <th className="border p-2">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {images.map((image) => (
                      <tr key={image.id} className="border">
                        <td className="border p-2">
                          <img
                            src={image.id}
                            alt={image.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="border p-2">
                          {image.name.length > 40
                            ? image.name.substring(0, 40) + "..."
                            : image.name}
                        </td>
                        <td className="border p-2 text-center">
                          <input
                            type="radio"
                            name="mainImage"
                            checked={mainImage === image.id}
                            onChange={() => setMainImage(image.id)}
                          />
                        </td>
                        <td className="p-2 text-center">
                          <FaTimesCircle
                            className="w-6 h-6 text-red-500 cursor-pointer"
                            onClick={() => handleRemoveImage(image.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={() => handlePost()}
                className="px-4 py-2 bg-[#483507] text-white rounded-lg hover:bg-[#483507] hover:cursor-pointer"
              >
                Add post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
