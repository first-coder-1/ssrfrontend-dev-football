import React from "react";
import Link from "next/link";

export class ErrorBoundary extends React.Component<
  any,
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      hasError: true,
      // errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Something went wrong.</h1>
          <Link href="/" style={{ color: "#4F4F4F" }}>
            Refresh the page
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
