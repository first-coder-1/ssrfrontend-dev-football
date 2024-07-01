import { makeAutoObservable } from "mobx";
import { Alert } from "@/models/Alert";

export class AlertStore {
  private map: Map<string, Alert> = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addAlert(alert: Alert) {
    this.map.set(alert.id, alert);
  }

  removeAlert(alert: Alert) {
    this.map.delete(alert.id);
  }

  get alerts() {
    return Array.from(this.map.values());
  }
}
