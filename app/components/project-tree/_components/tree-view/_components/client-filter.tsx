import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/components/ui/input-group";

interface ClientFilterProps {
  query: string;
  count: number;
  onQueryChange: (query: string) => void;
}

export function ClientFilter({ query, count, onQueryChange }: ClientFilterProps) {
  return (
    <div className="border-b p-3">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter clients"
          aria-label="Filter clients by name"
        />
        <InputGroupAddon align="inline-end" className="text-xs tabular-nums text-muted-foreground">
          {count}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
