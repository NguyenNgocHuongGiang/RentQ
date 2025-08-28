import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureSectionProps {
  onSave?: (dataURL: string) => void;
}

const SignatureSection = ({ onSave }: SignatureSectionProps) => {
  const sigPad = useRef<SignatureCanvas>(null);
  const [signature, setSignature] = useState<string>("");

  const clearSignature = () => {
    sigPad.current?.clear();
    setSignature("");
    onSave?.("");
  };

  const saveSignature = () => {
    if (sigPad.current) {
      const canvas = sigPad.current.getCanvas();
      const data = canvas.toDataURL("image/png");
      setSignature(data);
      onSave?.(signature);
    }
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigPad}
        penColor="black"
        canvasProps={{
          width: 300,
          height: 150,
          className: "border border-gray-400",
        }}
      />
      <div className="flex justify-center mt-2 space-x-2 no-export">
        <button onClick={saveSignature} className="px-2 py-1 border">
          Lưu
        </button>
        <button
          onClick={clearSignature}
          className="px-2 py-1 border cursor-pointer"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default SignatureSection;
