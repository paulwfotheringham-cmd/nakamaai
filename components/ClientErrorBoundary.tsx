"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };

type State = { error: Error | null };

export class ClientErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ClientErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-[min(78vh,720px)] flex-col items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/20 px-6 text-center text-sm text-red-200">
            <p>3D guide failed to load.</p>
            <p className="text-xs text-red-300/80">{this.state.error.message}</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
