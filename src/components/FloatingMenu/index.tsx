import { useContext, useState } from "react";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/use-disclosure";
// SVG ICONS
import ManualIcon from "./icons/ManualIcon";
import QrIcon from "./icons/ScanIcon";
import ImortIcon from "./icons/Import";
import ExportIcon from "./icons/Export";
import MenuIcon from "./icons/MenuIcon";
import DeleteIcon from "./icons/delete";

//Action Handler
import importAction from "./actions/import";
import exportAction from "./actions/export";
import qrAction from "./actions/qr";
import deleteAction from "./actions/delete";
import ManualUiAndHandler from "./ManualModel";

// import ManualAction from "./actions/manual";
import { SecretEntry } from "../../libs/FS";
import { Context } from "../../App";

export default function () {
  const { otp, setOtp } = useContext(Context);
  const [isExpanded, setIsExpanded] = useState(false);

  const ActionItem: React.FC<{
    icon: React.ReactElement<SVGAElement>;
    label: string;
    expanded: boolean;
    onClick: VoidFunction;
  }> = ({ icon, label, expanded, onClick }) => (
    <div
      className={
        "group inline-flex gap-2 items-center cursor-pointer font-semibold text-foreground-500 hover:text-foreground-800 transition-all duration-300" +
        +(expanded ? "translate-y-full" : "translate-y-full")
      }
    >
      <span className="">{label}</span>
      <Button
        size="sm"
        variant="solid"
        className="rounded-full inline-block text-foreground-500 group-hover:text-foreground-800"
        onClick={onClick}
        isIconOnly
      >
        {icon}
      </Button>
    </div>
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modelInput, setModelInput] = useState<SecretEntry>({
    algorithm: "sha1",
    digits: 6,
    email: "",
    label: "",
    issuer: "",
    period: 30,
    secret: "",
    type: "totp",
  });

  return (
    <>
      <ManualUiAndHandler
        setInputState={setModelInput}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        inputState={modelInput}
        setOtp={setOtp}
      />
      <div className="fixed bottom-6 right-6 z-10">
        <div className="relative">
          {isExpanded && (
            <div className="absolute bottom-16 right-0 flex flex-col items-center gap-y-4">
              {/* Manual */}
              <ActionItem
                icon={<ManualIcon />}
                onClick={() => {
                  setIsExpanded(false);
                  onOpen();
                }}
                label="Manual"
                expanded={isExpanded}
              />
              {/* QRCODE */}
              <ActionItem
                icon={<QrIcon />}
                onClick={() => {
                  setIsExpanded(false);
                  qrAction(setOtp);
                }}
                label="Qrscan"
                expanded={isExpanded}
              />
              {/* Import */}
              <ActionItem
                icon={<ImortIcon />}
                onClick={() => {
                  setIsExpanded(false);
                  importAction(setOtp);
                }}
                label="Import"
                expanded={isExpanded}
              />
              {/* EXPORT */}
              <ActionItem
                icon={<ExportIcon />}
                onClick={() => {
                  setIsExpanded(false);
                  exportAction(otp);
                }}
                label="Export"
                expanded={isExpanded}
              />
              <ActionItem
                icon={<DeleteIcon />}
                onClick={() => {
                  deleteAction(setOtp);
                }}
                label="Delete"
                expanded={isExpanded}
              />
            </div>
          )}
          <div
            className={`size-10 rounded-full bg-white/10 cursor-pointer transition-transform duration-300 ${
              isExpanded ? "rotate-45" : "rotate-0"
            }`}
            onClick={() => setIsExpanded((pre) => !pre)}
            // whileTap={{ scale: 0.9, transition: { duration: 0 } }}
            // whileHover={{ scale: 1.1, transition: { duration: 0 } }}
          >
            <MenuIcon />
          </div>
        </div>
      </div>
    </>
  );
}
