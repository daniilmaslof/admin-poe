/**
 * File.
 */
export class FileModel {
  /**
   * File name.
   */
  public name: string;

  /**
   * File type.
   */
  public type: string;

  /**
   * File.
   */
  public file?: File;

  /**
   * File in base64 format or url to file.
   */
  public url?: string;

  public constructor(data: Partial<FileModel>) {
    this.name = data.name;
    this.file = data.file;
    this.type = data.type;
    this.url = data.url;
  }

  /**
   * Indicates whether the file needs to be converted to base64 or uploaded to the server.
   */
  public get isUploaded(): boolean {
    return !!this.url;
  }

  /**
   * File extension.
   */
  public get fileExtension(): string {
    return this.name.split('.').pop() ?? '';
  }

  /**
   * File name.
   */
  public get fileName(): string {
    return this.name.split('.').slice(0, -1).join('.');
  }
}
