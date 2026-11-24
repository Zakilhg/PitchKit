import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setTheme, useTheme, useThemePreference } from "@/lib/theme";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

const ThemeMenu = () => {
  const theme = useTheme();
  const preference = useThemePreference();
  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Theme: ${preference}`}>
          <Icon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={preference} onValueChange={setTheme}>
          {OPTIONS.map(({ value, label, icon: OptionIcon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <OptionIcon aria-hidden="true" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/** Segmented Light / Dark / System control for the mobile menu. */
export const ThemeSegmented = () => {
  const preference = useThemePreference();

  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 rounded-lg bg-muted p-1">
      {OPTIONS.map(({ value, label, icon: OptionIcon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          onClick={() => setTheme(value)}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm text-muted-foreground transition aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm"
        >
          <OptionIcon className="size-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default ThemeMenu;
