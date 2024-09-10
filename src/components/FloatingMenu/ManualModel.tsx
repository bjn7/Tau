import { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Select, SelectItem } from "@nextui-org/select";

//@ts-ignore
import { authenticator } from "@otplib/preset-browser";

import { SecretEntry, writeSecrets } from "../../libs/FS";
import cacheImage from "../../libs/fetchAndCacheIcon";

export default function ({
  inputState,
  setInputState,
  isOpen,
  onOpenChange,
  setOtp,
}: {
  inputState: SecretEntry;
  setInputState: React.Dispatch<React.SetStateAction<SecretEntry>>;
  isOpen: boolean;
  onOpenChange: VoidFunction;
  setOtp: React.Dispatch<React.SetStateAction<SecretEntry[]>>;
}) {
  const setState = (key: string, value: string | number): void => {
    setInputState((pre) => ({
      ...pre,
      [key]: value,
    }));
  };

  const isInvalid = useMemo(() => {
    try {
      authenticator.options = {
        algorithm: inputState["algorithm"],
        step: inputState["period"],
        digits: inputState["digits"],
      };
      authenticator.generate(inputState["secret"]);
      return false;
    } catch {
      return true;
    }
  }, [inputState["secret"]]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Manual</ModalHeader>
            <ModalBody>
              <Input
                placeholder="Issuer ex. discord"
                size="sm"
                value={inputState?.["issuer"]}
                onValueChange={(e) => {
                  setState("label", e);
                  setState("issuer", e);
                }}
              />
              <Input
                placeholder="Secret"
                size="sm"
                value={inputState?.["secret"]}
                isInvalid={isInvalid}
                errorMessage={"Invalid Secret"}
                onValueChange={(e) => setState("secret", e)}
              />
              <Input
                placeholder="Email or Username"
                size="sm"
                value={inputState?.["email"]}
                onValueChange={(e) => setState("email", e)}
              />

              <Accordion aria-label="Advanced" title="Advanced">
                <AccordionItem title={"Advanced"}>
                  <div className="space-y-3">
                    <Input
                      placeholder="Period"
                      size="sm"
                      type="number"
                      label="Period"
                      labelPlacement="outside"
                      value={inputState?.["period"].toString()}
                      onValueChange={(e) => setState("email", parseInt(e))}
                    />
                    <div className="space-x-4">
                      <span>Digits</span>
                      <Select
                        defaultSelectedKeys={["6"]}
                        size="sm"
                        className="w-28 inline-block"
                        disallowEmptySelection
                        selectedKeys={[inputState["digits"].toString()]}
                        onChange={(e) => {
                          return setState("digits", parseInt(e.target.value));
                        }}
                      >
                        <SelectItem key={"6"} value={6}>
                          6
                        </SelectItem>
                        <SelectItem key={"8"} value={8}>
                          8
                        </SelectItem>
                      </Select>
                    </div>
                    <div className="space-x-4">
                      <span>Algorithm</span>
                      <Select
                        defaultSelectedKeys={["sha1"]}
                        size="sm"
                        className="w-28 inline-block"
                        disallowEmptySelection
                      >
                        <SelectItem key={"sha1"} value={"sha1"}>
                          SHA-1
                        </SelectItem>
                        <SelectItem key={"sha256"} value={"sha256"}>
                          SHA-256
                        </SelectItem>
                        <SelectItem key={"sha512"} value={"sha512"}>
                          SHA-512
                        </SelectItem>
                      </Select>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                isDisabled={
                  inputState["issuer"] == "" ||
                  inputState["email"] == "" ||
                  inputState["secret"] == "" ||
                  isInvalid
                }
                onClick={async () => {
                  onClose();
                  await cacheImage(inputState.issuer);
                  setOtp((pre) => {
                    writeSecrets([...pre, inputState]);
                    return [...pre, inputState];
                  });
                  setInputState({
                    algorithm: "sha1",
                    digits: 6,
                    email: "",
                    label: "",
                    issuer: "",
                    period: 30,
                    secret: "",
                    type: "totp",
                  });
                }}
              >
                save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
