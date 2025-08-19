import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import SignatureSection from "../../../../AdminTemplate/Contracts/component/SignatureSection";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PDFViewer = ({ file }: { file: File }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    renderPDF();
  }, [file]);

  // const renderPDF = async () => {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  //   const viewer = containerRef.current;
  //   if (viewer) viewer.innerHTML = "";

  //   let signatureDetected = false;

  //   console.log(pdf.numPages);

  //   for (let i = 1; i <= pdf.numPages; i++) {
  //     const page = await pdf.getPage(i);
  //     console.log(page);

  //     const textContent = await page.getTextContent();
  //     const pageText = textContent.items.map((item: any) => item.str).join(" ");

  //     console.log(textContent);

  //     if (
  //       !signatureDetected &&
  //       (pageText.toLowerCase().includes("bên b ký tên") ||
  //         pageText.toLowerCase().includes("bên b ký") ||
  //         pageText.toLowerCase().includes("signature b") ||
  //         pageText.toLowerCase().includes("bên thuê"))
  //     ) {
  //       console.log(1111111111111);

  //       signatureDetected = true;
  //     }

  //     const viewport = page.getViewport({ scale: 1.2 });
  //     const canvas = document.createElement("canvas");
  //     const context = canvas.getContext("2d")!;
  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;

  //     const pageWrapper = document.createElement("div");
  //     pageWrapper.className = "mb-5";
  //     pageWrapper.appendChild(canvas);
  //     viewer?.appendChild(pageWrapper);

  //     await page.render({ canvasContext: context, viewport }).promise;
  //   }

  //   // Sau khi render xong các trang
  //   if (signatureDetected) {
  //     setShowSignature(true);
  //   }
  // };
  const renderPDF = async () => {
    setLoading(true); // Bắt đầu loading

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const viewer = containerRef.current;
    if (viewer) viewer.innerHTML = "";

    let signatureDetected = false;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const pageWrapper = document.createElement("div");
      pageWrapper.className = "mb-5";
      pageWrapper.appendChild(canvas);
      viewer?.appendChild(pageWrapper);

      await page.render({ canvasContext: context, viewport }).promise;

      if (!signatureDetected) {
        const dataUrl = canvas.toDataURL();
        const result = await Tesseract.recognize(dataUrl, "vie+eng", {
          logger: (m) => console.log(m),
        });

        const text = result.data.text.toLowerCase();

        if (
          text.includes("bên b ký tên") ||
          text.includes("bên b ký") ||
          text.includes("signature b") ||
          text.includes("bên thuê")
        ) {
          console.log("📌 Phát hiện chữ ký thông qua OCR");
          signatureDetected = true;
        }
      }
    }

    if (signatureDetected) {
      setShowSignature(true);
    }

    setLoading(false); // Kết thúc loading
  };

  return (
    <div className="w-full relative">
      {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-gray-700 text-lg font-medium animate-pulse">Đang xử lý file PDF...</div>
      </div>
    )}
      <div ref={containerRef} className={loading ? "invisible" : ""} />
      {showSignature && (
        <div className="mt-4">
          <p className="font-semibold">Your Signature:</p>
          <SignatureSection />
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
