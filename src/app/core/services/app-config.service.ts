import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * App config service.
 * Provides information about current application environment configuration.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  /**
   * API base URL.
   */
  public apiUrl = `${environment.apiEndpoint}/api/admin-panel`;
}
