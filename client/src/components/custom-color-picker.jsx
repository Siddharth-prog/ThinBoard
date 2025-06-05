import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn, colorToCss } from "@/lib/utils";
import { useForwardedRef } from "@/hooks/forwardRef";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDebouncyEffect } from "use-debouncy";

const CustomColorPicker = forwardRef(({
  disabled,
  value,
  lastUsedColor,
  onChange,
  onBlur,
  name,
  className,
  ...props
}, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef);
  const [open, setOpen] = useState(false);

  const parsedValue = useMemo(() => {
    return value || colorToCss(lastUsedColor);
  }, [value, lastUsedColor]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          variant="outline"
        >
          <img
            className="rounded-full"
            src="/color-picker.png"
            alt="Empty"
            height={40}
            width={40}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" sideOffset={-1000} className="w-full mb-16">
        <DebouncedPicker color={parsedValue} onChange={onChange} />
        <Input
          className="mt-2"
          maxLength={7}
          onChange={(e) => {
            onChange(e.currentTarget.value);
          }}
          ref={ref}
          value={parsedValue}
        />
      </PopoverContent>
    </Popover>
  );
});

CustomColorPicker.displayName = "ColorPicker";

const DebouncedPicker = ({ color, onChange }) => {
  const [value, setValue] = useState(color);

  useDebouncyEffect(() => onChange(value), 200, [value]);

  return <HexColorPicker color={value} onChange={setValue} />;
};

export { CustomColorPicker };
