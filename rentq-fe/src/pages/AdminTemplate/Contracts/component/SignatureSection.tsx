import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";


const SignatureSection = () => {
  const sigPad = useRef<SignatureCanvas>(null);
  const [signature, setSignature] = useState<string>("");

  const clearSignature = () => {
    sigPad.current?.clear();
    setSignature("");
  };

  // const saveSignature = () => {
  //   if (sigPad.current) {
  //     setSignature(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
  //   }
  // };

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
        {/* <button onClick={saveSignature} className="px-2 py-1 border">
          Lưu
        </button> */}
        <button onClick={clearSignature} className="px-2 py-1 border cursor-pointer">
          Xóa
        </button>
      </div>
      {signature && (
        <div className="mt-2">
          <img src={signature} alt={`Signature`} />
        </div>
      )}
    </div>
  );
};

export default SignatureSection;
