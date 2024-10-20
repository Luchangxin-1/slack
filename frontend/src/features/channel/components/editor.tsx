import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill, { type QuillOptions } from "quill";
import { PiTextAa, PiXLight } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { ImageIcon, Keyboard, Smile } from "lucide-react";
import Hint from "@/components/hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
type EditorValue = {
  image: File | null;
  body: string;
};
interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placholder: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}
const Editor = ({
  variant = "create",
  disabled = false,
  onSubmit,
  onCancel,
  placholder = "Write down something...",
  defaultValue = [],
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placholderRef = useRef(placholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placholderRef.current = placholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);
  const toogleToobar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };
  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  console.log({ isEmpty, text });
  return (
    <div className="flex flex-col ">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formating" : "Shaw formating"}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toogleToobar}
            >
              <PiTextAa className="size-4 " />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={false}
              size="iconSm"
              variant="ghost"
              onClick={() => {}}
            >
              <Smile className="size-4 " />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => {}}
              >
                <ImageIcon className="size-4 " />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {}}
                disabled={disabled || isEmpty}
                className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint label="Send">
              <Button
                size="iconSm"
                disabled={disabledRef.current || isEmpty}
                onClick={() => {}}
                className={cn(
                  "ml-auto ",
                  "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                )}
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;