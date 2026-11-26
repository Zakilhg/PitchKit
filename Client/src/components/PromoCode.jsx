import { useState } from "react";
import { Loader2, TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Discount code entry for the checkout summary. The server decides whether a
 * code works: `applied` is what it accepted, `error` why it didn't.
 */
const PromoCode = ({ applied, error, checking, onApply, onRemove }) => {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <TicketPercent className="size-4 shrink-0 text-success" aria-hidden="true" />
          <span className="font-mono font-medium">{applied.code}</span>
          <span className="truncate text-muted-foreground">{applied.label}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onRemove();
          }}
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Remove code ${applied.code}`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (!open && !error) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm font-medium underline underline-offset-4"
      >
        Have a discount code?
      </button>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    const code = draft.trim();
    if (code) onApply(code);
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo-code" className="text-sm font-medium">
        Discount code
      </label>
      <div className="mt-2 flex gap-2">
        <Input
          id="promo-code"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          autoFocus={!error}
          placeholder="WELCOME10"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "promo-code-error" : undefined}
          className="h-10 font-mono uppercase placeholder:normal-case"
        />
        <Button type="submit" variant="outline" className="h-10" disabled={checking || !draft.trim()}>
          {checking && <Loader2 className="animate-spin" aria-hidden="true" />}
          Apply
        </Button>
      </div>
      <div aria-live="polite">
        {error && (
          <p id="promo-code-error" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

export default PromoCode;
