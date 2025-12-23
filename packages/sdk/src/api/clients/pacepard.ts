import AuthAPI from "./auth";
import type AxiosService from "../core/axios";

/**
 * PacepardAPIClient - Internal API client class
 * This is the base class that PacepardAPI extends
 */
export class PacepardAPIClient {
  public auth: AuthAPI;

  constructor(axiosService: AxiosService) {
    this.auth = new AuthAPI(axiosService);
  }
}

export default PacepardAPIClient;
