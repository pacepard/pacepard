
import {
  IOrganisationDoc,
  IResult,
  IFile,
} from "../utils/interfaces.util";
import {
  createOrganisationDTO,
  updateOrganisationDTO,
  updateSocialLinksDTO,
} from "../modules/organization/organization.dto";
import storageService from "../services/storage.service";
import mongoose from "mongoose";
import Organisation from "../modules/organization/organization.model";

class OrganisationService {
  /**
   * @method createOrganisation
   * @description Creates a new organisation profile.
   */
  public async createOrganisation(
    data: createOrganisationDTO & { createdBy: string }
  ): Promise<IResult<IOrganisationDoc>> {
    const result: IResult<IOrganisationDoc> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const { email, createdBy } = data;

    // Check if an organisation with this email already exists
    const existingOrg = await Organisation.findOne({ email });
    if (existingOrg) {
      result.error = true;
      result.code = 409;
      result.message = "Organisation with this email already exists.";
      return result;
    }

    const orgData = {
      ...data,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    };

    const newOrganisation = await Organisation.create(orgData as any);

    if (!newOrganisation) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create organisation profile.";
      return result;
    }

    result.message = "Organisation profile created successfully.";
    result.code = 201;
    result.data = newOrganisation;
    return result;
  }

  /**
   * @method getOrganisation
   * @description Retrieves a single organisation by its ID.
   */
  public async getOrganisation(
    orgId: string
  ): Promise<IResult<IOrganisationDoc>> {
    const result: IResult<IOrganisationDoc> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const organisation = await Organisation.findById(orgId)
      .populate("users")
      .populate("evaluators")
      .populate("mentors")
      .populate("createdBy")
      .populate("settings")
      .populate("hackathons")
      .populate("projects")
      .populate("competitions");

    if (!organisation) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.data = organisation;
    result.message = "Organisation fetched successfully.";
    return result;
  }

  /**
   * @method updateOrganisation
   * @description Updates an organisation's profile details.
   */
  public async updateOrganisation(
    orgId: string,
    data: updateOrganisationDTO
  ): Promise<IResult<IOrganisationDoc>> {
    const result: IResult<IOrganisationDoc> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const updatedOrg = await Organisation.findByIdAndUpdate(
      orgId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.message = "Organisation updated successfully.";
    result.data = updatedOrg;
    return result;
  }

  /**
   * @method deleteOrganisation
   * @description Deletes an organisation and its associated data.
   */
  public async deleteOrganisation(orgId: string): Promise<IResult<null>> {
    const result: IResult<null> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const deletedOrg = await Organisation.findByIdAndDelete(orgId);

    if (!deletedOrg) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.message = "Organisation deleted successfully.";
    return result;
  }

  /**
   * @method updateSocialLinks
   * @description Updates an organisation's social media links.
   */
  public async updateSocialLinks(
    orgId: string,
    socialLinks: updateSocialLinksDTO
  ): Promise<IResult<IOrganisationDoc>> {
    const result: IResult<IOrganisationDoc> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const updatedOrg = await Organisation.findByIdAndUpdate(
      orgId,
      { $set: { socialLinks } },
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.message = "Social links updated successfully.";
    result.data = updatedOrg;
    return result;
  }

  /**
   * @method addPartner
   * @description Adds a partner to the organisation's partners list.
   */
  public async addPartner(orgId: string, partner: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedOrg = await Organisation.findByIdAndUpdate(
      orgId,
      { $addToSet: { partners: partner } },
      { new: true }
    );

    if (!updatedOrg) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.message = "Partner added successfully.";
    result.data = updatedOrg.partners;
    return result;
  }

  /**
   * @method removePartner
   * @description Removes a partner from the organisation's partners list.
   */
  public async removePartner(
    orgId: string,
    partner: string
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedOrg = await Organisation.findByIdAndUpdate(
      orgId,
      { $pull: { partners: partner } },
      { new: true }
    );

    if (!updatedOrg) {
      result.error = true;
      result.code = 404;
      result.message = "Organisation not found.";
      return result;
    }

    result.message = "Partner removed successfully.";
    result.data = updatedOrg.partners;
    return result;
  }

  /**
   * @method uploadBanner
   * @description Uploads the organisation's banner image.
   */
  public async uploadBanner(
    orgId: string,
    file: IFile
  ): Promise<IResult<string>> {
    const result: IResult<string> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };
    try {
      const uploadResult = await storageService.uploadFile(file);

      if (uploadResult.error) {
        return uploadResult as IResult<string>;
      }

      const updatedOrg = await Organisation.findByIdAndUpdate(
        orgId,
        { $set: { banner: uploadResult.data.Location } },
        { new: true }
      );

      if (!updatedOrg) {
        result.error = true;
        result.code = 404;
        result.message = "Organisation not found.";
        return result;
      }

      result.message = "Banner uploaded successfully.";
      result.data = updatedOrg.banner;
      return result;
    } catch (err) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to upload banner.";
      return result;
    }
  }

  /**
   * @method uploadLogo
   * @description Uploads the organisation's logo.
   */
  public async uploadLogo(orgId: string, file: IFile): Promise<IResult<string>> {
    const result: IResult<string> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };
    try {
      const uploadResult = await storageService.uploadFile(file);

      if (uploadResult.error) {
        return uploadResult as IResult<string>;
      }

      const updatedOrg = await Organisation.findByIdAndUpdate(
        orgId,
        { $set: { logo: uploadResult.data.Location } },
        { new: true }
      );

      if (!updatedOrg) {
        result.error = true;
        result.code = 404;
        result.message = "Organisation not found.";
        return result;
      }

      result.message = "Logo uploaded successfully.";
      result.data = updatedOrg.logo;
      return result;
    } catch (err) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to upload logo.";
      return result;
    }
  }
}

export default new OrganisationService();