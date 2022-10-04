export class Settings {
  greetingText: string;

  sosMessage: string;
  unloginTimeInSeconds: string;
  dataUpdateTimeInSeconds: string;
  idleTimeInSeconds: string;
  showQuickSearch: string;
  constructor(data: Partial<Settings>) {
    this.showQuickSearch = data.showQuickSearch;
    this.greetingText = data.greetingText;
    this.unloginTimeInSeconds = data.unloginTimeInSeconds;
    this.sosMessage = data.sosMessage;
    this.idleTimeInSeconds = data.idleTimeInSeconds;
    this.dataUpdateTimeInSeconds = data.dataUpdateTimeInSeconds;
  }
}
