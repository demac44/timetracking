"use client";

import { catchError } from "next/error";
import { PaneFallback } from "./_components/pane-fallback";

export const PaneBoundary = catchError(PaneFallback);
