import { Card, CardBody } from "@nextui-org/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Image from "./Image";

export default function ({
  issuer,
  label,
  email,
  code,
  search,
  timeRem,
  period,
}: {
  issuer: string;
  label: string;
  email: string;
  code: string;
  search: string;
  timeRem: number;
  period: number;
}) {
  return (
    <Card
      className={`h-24 xl:h-28 cursor-pointer hover:bg-white/5 select-none ${
        label.toUpperCase().includes(search.toLocaleUpperCase())
          ? "flex"
          : "hidden"
      } items-center justify-center`}
      onDoubleClick={() => {
        navigator.clipboard
          .writeText(code || "")
          .then(() => toast.success("Copied to clipboard"))
          .catch(() => toast.error("Failed to copy!"));
      }}
    >
      <div className="h-0.5 w-full relative">
        <motion.div
          className={`absolute top-0 left-0 h-full bg-white/15`}
          key={timeRem}
          style={{
            width: (timeRem / period) * 100 + "%",
          }}
          animate={{
            width: 0,
          }}
          transition={{
            duration: timeRem,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>
      <CardBody>
        <div className="flex items-center gap-5 h-full">
          <Image issuer={issuer} />
          <div>
            <div className="font-semibold lg:text-lg">{label}</div>
            <div className="font-semibold text-sm lg:text-medium text-foreground-500">
              {email}
            </div>
            <div className="font-semibold lg:text-lg">
              {code?.split("").join(" ")}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
