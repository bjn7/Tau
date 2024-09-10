import { useState, useContext, useEffect, useRef, useCallback } from "react";
//@ts-ignore
import { authenticator } from "@otplib/preset-browser";
import { Input } from "@nextui-org/input";

import { readSecrets } from "../../libs/FS.ts";
import deepLink from "../../libs/deepLink.ts";
import useEffectOnce from "../../hooks/useEffectOnce.tsx";
import { Context } from "../../App.tsx";
import Card from "./card.tsx";

export default function () {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasError, setHasError] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);
  const { otp, setOtp } = useContext(Context);
  const [generatedCodes, setGeneratedCodes] = useState<{
    [key: string]: string;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState<{
    [key: string]: number;
  }>({});

  const intervals = useRef<number[]>([]);

  const generateCodes = useCallback(
    (entry: (typeof otp)[number]) => {
      authenticator.options = {
        algorithm: entry.algorithm,
        step: entry.period,
        digits: entry.digits,
      };
      const token = authenticator.generate(entry.secret);
      setGeneratedCodes((prevCodes) => ({
        ...prevCodes,
        [entry.secret]: token,
      }));
    },
    [otp]
  );

  useEffect(() => {
    deepLink();
    const updateCodesAndTime = (entry: (typeof otp)[number]) => {
      generateCodes(entry);

      const period = entry.period;
      const calcTimeRemaining =
        period - (Math.floor(Date.now() / 1000) % period);

      setTimeRemaining((prevTime) => ({
        ...prevTime,
        [entry.period]: calcTimeRemaining,
      }));

      intervals.current.push(
        setTimeout(() => {
          updateCodesAndTime(entry); // Recursive call to continue the cycle
        }, calcTimeRemaining * 1000) as unknown as number
      );
    };

    otp.forEach((entry) => {
      updateCodesAndTime(entry);
    });

    return () => {
      intervals.current.forEach(clearTimeout);
    };
  }, [otp]);

  useEffectOnce(() => {
    readSecrets()
      .then(setOtp)
      .catch((error) => {
        console.error(error);
        setHasError(true);
      })
      .finally(() => {
        console.log("Loaded!");
        setIsLoading(false);
      });
  }, []);

  if (hasError) return <p>Failed to parse the secrets.</p>;

  return (
    <div className="container mx-auto p-4">
      <Input
        startContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-foreground-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        }
        onValueChange={setSearchQuery}
        value={searchQuery}
        size="md"
        placeholder="Search"
        classNames={{
          inputWrapper: "w-1/2 lg:w-1/3 self-center ",
        }}
      />
      <div className="container mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {otp.map((entry, index) => (
          <Card
            key={index}
            search={searchQuery}
            issuer={entry.issuer.toLocaleLowerCase()}
            // email={/@*.com/.test(entry.email) ? entry.email : ""}
            // label={
            //   /@*.com/.test(entry.email)
            //     ? entry.label
            //     : `${entry.label} ${entry.email}`
            // }
            email={entry.email}
            label={entry.label}
            code={
              entry.secret in generatedCodes ? generatedCodes[entry.secret] : ""
            }
            period={entry.period}
            timeRem={
              entry.period in timeRemaining ? timeRemaining[entry.period] : 0
            }
          />
        ))}
      </div>
    </div>
  );
}
