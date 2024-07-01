export enum AlertSeverity {
  success = "success",
  warning = "warning",
  error = "error",
}

export class Alert {
  id: string;

  constructor(
    public message: string,
    public severity: AlertSeverity,
    public title: string | null = null,
  ) {
    this.id = Math.random().toString(16);
  }
}
