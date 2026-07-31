"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search/search-dialog";

/** Search trigger button that opens the global search dialog. */
export function SearchButton() {
  return (
    <SearchDialog>
      <Button variant="ghost" size="icon" aria-label="Search (Cmd/Ctrl+K)">
        <Search className="h-5 w-5" />
      </Button>
    </SearchDialog>
  );
}

