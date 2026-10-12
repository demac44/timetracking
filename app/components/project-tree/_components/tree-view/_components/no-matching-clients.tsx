import { Button } from "@/app/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/app/components/ui/empty";

interface NoMatchingClientsProps {
  query: string;
  onClear: () => void;
}

export function NoMatchingClients({ query, onClear }: NoMatchingClientsProps) {
  return (
    <Empty className="m-3">
      <EmptyHeader>
        <EmptyTitle>No matching clients</EmptyTitle>
        <EmptyDescription>Nothing matches “{query.trim()}”.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear filter
        </Button>
      </EmptyContent>
    </Empty>
  );
}
