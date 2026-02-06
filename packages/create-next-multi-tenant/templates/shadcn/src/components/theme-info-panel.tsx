"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";

const CSS_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const;

export function ThemeInfoPanel({ tenantSlug }: { tenantSlug: string }) {
  const [expanded, setExpanded] = useState(false);

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="h-4 w-4" />
            Theme Tokens
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{tenantSlug}</Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleExpanded}
            >
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {CSS_VARS.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="h-5 w-5 shrink-0 rounded border border-border"
                  style={{ backgroundColor: `var(--${name})` }}
                />
                <span className="font-mono text-muted-foreground">
                  --{name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
