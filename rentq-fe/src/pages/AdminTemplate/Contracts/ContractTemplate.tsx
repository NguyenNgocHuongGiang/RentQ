import { useEffect, useState } from "react";
import { Button, Input, DatePicker, Select } from "antd";
import moment from "moment";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { getUserProperties } from "../../../store/slice/propertySlice";
import { getAuthData, numberToVietnameseWords } from "../../../utils/helpers";
import { PropertyType } from "../../../types/types";
import MiniTemplate from "./component/MiniTemplate";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const { Option } = Select;

const ContractTemplate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { listProperties, loading } = useSelector(
    (state: any) => state.propertyReducer
  );
  const [place, setPlace] = useState("");
  const [landlord, setLandlord] = useState({
    name: "",
    cardNumber: "",
    dateIssue: "",
    placeIssue: "",
    address: "",
    rightsLandlord: "",
    dutiesLandlord: "",
  });
  const [tenant, setTenant] = useState({
    name: "",
    cardNumber: "",
    dateIssue: "",
    placeIssue: "",
    address: "",
    rightsTenant: "",
    dutiesTenant: "",
  });
  const [property, setProperty] = useState({} as any);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndtDate] = useState<string | null>(null);
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");

  useEffect(() => {
    dispatch(getUserProperties(getAuthData()?.userId)).unwrap();
    paginateContract("contract");
  }, []);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("contract-preview");
    if (!element) return;

    const pages = Array.from(element.querySelectorAll(".page"));
    if (pages.length === 0) return;

    // Thêm class pdf-exporting để ẩn phần không muốn export
    document.body.classList.add("pdf-exporting");

    const overlays: HTMLDivElement[] = [];

    pages.forEach((page) => {
      const overlay = document.createElement("div");
      overlay.classList.add("scan-overlay");
      (page as HTMLElement).style.position = "relative"; // đảm bảo có position
      page.appendChild(overlay);
      overlays.push(overlay);
    });

    // Lưu lại display gốc, set sang block
    const originalDisplays = pages.map((page) => {
      const d = (page as HTMLElement).style.display;
      (page as HTMLElement).style.display = "block";
      return d;
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const paddingLeft = 10;
    const paddingRight = 10;
    const paddingTop = 10;
    const paddingBottom = 10;

    const usablePageWidth = pdfWidth - paddingLeft - paddingRight;
    const usablePageHeight = pdfHeight - paddingTop - paddingBottom;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      const canvas = await html2canvas(page, {
        scale: 2,
        ignoreElements: (el) => {
          return (
            el.classList.contains("no-export") ||
            el.classList.contains("scan-overlay") ||
            el.tagName === "BUTTON"
          );
        },
      });

      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      let imgWidthMm = usablePageWidth;
      let imgHeightMm = (imgHeightPx * imgWidthMm) / imgWidthPx;

      if (imgHeightMm > usablePageHeight) {
        const scaleRatio = usablePageHeight / imgHeightMm;
        imgHeightMm = usablePageHeight;
        imgWidthMm = imgWidthMm * scaleRatio;
      }

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        paddingLeft,
        paddingTop,
        imgWidthMm,
        imgHeightMm,
        undefined,
        "FAST"
      );
    }

    // Khôi phục display
    pages.forEach((page, idx) => {
      (page as HTMLElement).style.display = originalDisplays[idx];
    });

    overlays.forEach((overlay) => {
      overlay.parentNode?.removeChild(overlay);
    });

    // Xóa class pdf-exporting
    document.body.classList.remove("pdf-exporting");

    pdf.save("hop-dong-thue-nha.pdf");
  };

  const paginateContract = (containerId: any) => {
    const container = document.getElementById(containerId);
    const container2 = document.getElementById("contract-preview");
    if (!container) {
      return;
    }
    
    const oldControls = document.getElementById("pagination-controls");
    if (oldControls) {
      oldControls.remove();
    }

    const children = Array.from(container.children);
    const pages: HTMLDivElement[] = [];
    const PAGE_HEIGHT = 1050;

    let currentPage = document.createElement("div");
    currentPage.className = "page";
    pages.push(currentPage);

    // Append tạm để đo
    container.appendChild(currentPage);

    children.forEach((child) => {
      currentPage.appendChild(child);
      if (currentPage.offsetHeight > PAGE_HEIGHT) {
        currentPage.removeChild(child);
        currentPage = document.createElement("div");
        currentPage.className = "page";
        pages.push(currentPage);
        currentPage.appendChild(child);
        container.appendChild(currentPage);
      }
    });

    // Xóa nội dung cũ của container
    container.innerHTML = "";

    // Append các page đã phân lại vào container
    pages.forEach((page) => {
      container.appendChild(page);
    });

    // Hiện page đầu tiên
    let currentPageIndex = 0;
    pages[currentPageIndex].style.display = "block";

    // Tạo controls
    const controls = document.createElement("div");
    controls.id = "pagination-controls";

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.style.marginRight = "10px";

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.style.marginLeft = "10px";

    controls.appendChild(prevButton);
    controls.appendChild(nextButton);
    // Sau khi thêm controls vào container
    if (container2) {
      container2.appendChild(controls);
    }

    // Hàm update page hiển thị
    const updatePageVisibility = () => {
      pages.forEach((page, index) => {
        page.style.display = index === currentPageIndex ? "block" : "none";
      });
      prevButton.disabled = currentPageIndex === 0;
      prevButton.style.color = currentPageIndex === 0 ? "gray" : "black";
      nextButton.disabled = currentPageIndex === pages.length - 1;
      nextButton.style.color =
        currentPageIndex === pages.length - 1 ? "gray" : "black";
    };

    // Gọi update ngay sau khi tạo controls để ẩn các trang khác và disable nút đúng
    updatePageVisibility();

    // Sự kiện nút
    prevButton.addEventListener("click", () => {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        updatePageVisibility();
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        updatePageVisibility();
      }
    });
  };


  return (
    <div className="max-w-7xl mx-auto mb-10">
      <div className="flex gap-5 items-start py-8">
        {/* Form bên trái */}
        <div className="flex-[2] border border-gray-200 p-5 rounded-lg bg-[#dcdcdc7c]">
          <p className=" text-gray-500 text-sm font-sans mb-8">
            Instructions: Please fill in all contract information on the left
            panel. As you update the details, the contract preview on the right
            will automatically update accordingly. Once completed, you can
            download the contract as a PDF file for saving or printing.
          </p>
          <div className="flex flex-col gap-2.5">
            <Input
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <div className="flex gap-2 flex-col">
              <p className="text-xs ml-1">Persional Information</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Landlord Name"
                  value={landlord.name}
                  onChange={(e) =>
                    setLandlord((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Landlord Address"
                  value={landlord.address}
                  onChange={(e) =>
                    setLandlord((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Identity Card Number"
                  value={landlord.cardNumber}
                  onChange={(e) =>
                    setLandlord((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                />
                <DatePicker
                  className="w-full"
                  placeholder="Date of Issue"
                  value={landlord.dateIssue ? moment(landlord.dateIssue) : null}
                  onChange={(date) =>
                    setLandlord((prev) => ({
                      ...prev,
                      dateIssue: date ? date.toISOString() : "",
                    }))
                  }
                />
              </div>

              <Input
                placeholder="Place of Issue"
                value={landlord.placeIssue}
                onChange={(e) =>
                  setLandlord((prev) => ({
                    ...prev,
                    placeIssue: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-2 flex-col">
              <p className="text-xs ml-1 ">Tenant Information</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Tenant Name"
                  value={tenant.name}
                  onChange={(e) =>
                    setTenant((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Tenant Address"
                  value={tenant.address}
                  onChange={(e) =>
                    setTenant((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Identity Card Number"
                  value={tenant.cardNumber}
                  onChange={(e) =>
                    setTenant((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                />
                <DatePicker
                  className="w-full"
                  placeholder="Date of Issue"
                  value={tenant.dateIssue ? moment(tenant.dateIssue) : null}
                  onChange={(date) =>
                    setTenant((prev) => ({
                      ...prev,
                      dateIssue: date ? date.toISOString() : "",
                    }))
                  }
                />
              </div>

              <Input
                placeholder="Place of Issue"
                value={tenant.placeIssue}
                onChange={(e) =>
                  setTenant((prev) => ({
                    ...prev,
                    placeIssue: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-2 flex-col">
              <p className="text-xs ml-1">Contract Information</p>
              <Select
                placeholder="Select a property address"
                loading={loading}
                allowClear
                value={property.address || ""}
                onChange={(value) => {
                  const selectedProperty = listProperties?.find(
                    (prop: PropertyType) => prop.property_id === Number(value)
                  );
                  setProperty(selectedProperty || ({} as PropertyType));
                }}
              >
                {listProperties?.map((prop: PropertyType) => (
                  <Option key={prop.property_id} value={prop.property_id}>
                    {prop.address}
                  </Option>
                ))}
              </Select>

              <div className="flex gap-2">
                <DatePicker
                  placeholder="Start Date"
                  className="w-full"
                  onChange={(date) =>
                    setStartDate(date ? date.toISOString() : null)
                  }
                />
                <DatePicker
                  placeholder="End Date"
                  className="w-full"
                  onChange={(date) =>
                    setEndtDate(date ? date.toISOString() : null)
                  }
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Deposit (VND)"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
                <Input
                  placeholder="Rent (VND)"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </div>

              <p className="text-xs ml-1">Landlord'rights and duties</p>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter rights..."
                    value={landlord.rightsLandlord}
                    onChange={(e) =>
                      setLandlord((prev) => ({
                        ...prev,
                        rightsLandlord: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex-1">
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter duties..."
                    value={landlord.dutiesLandlord}
                    onChange={(e) =>
                      setLandlord((prev) => ({
                        ...prev,
                        dutiesLandlord: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <p className="text-xs ml-1">Tenant'rights and duties</p>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter rights..."
                    value={tenant.rightsTenant}
                    onChange={(e) =>
                      setTenant((prev) => ({
                        ...prev,
                        rightsTenant: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex-1">
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter duties..."
                    value={tenant.dutiesTenant}
                    onChange={(e) =>
                      setTenant((prev) => ({
                        ...prev,
                        dutiesTenant: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="primary"
                onClick={handleDownloadPDF}
                className="mt-2.5"
              >
                Download PDF
              </Button>
              {/* <Button type="primary" onClick={handleGetLink} className="mt-2.5">
                Upload and get link
              </Button> */}
            </div>
          </div>
        </div>

        {/* Preview bên phải */}
        <div
          id="contract-preview"
          className="flex-[3] border border-black rounded-none bg-white font-serif text-base leading-[1.8] text-black max-w-[900px] mx-auto"
        >
          <MiniTemplate
            place={place}
            landlord={landlord}
            tenant={tenant}
            property={property}
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            deposit={deposit}
            rent={rent}
            numberToVietnameseWords={numberToVietnameseWords}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractTemplate;
