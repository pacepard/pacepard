import { ProjectPreviewDTO } from "./project.dto";
import { IProjectDoc } from "./project.interface";

export const mapToProjectPreview = (doc: IProjectDoc): ProjectPreviewDTO => ({
  id: doc._id.toString(),
  title: doc.title,
  slug: doc.slug,
  tagline: doc.tagline,
  image: doc.image,
  category: doc.category,
  tags: doc.tags,
  type: doc.type,
  isOpen: doc.isOpen,
  publishedAt: doc.publishedAt,
  createdBy: {
    id: doc.createdBy.id,
    name: doc.createdBy.name,
    type: doc.creatorType,
  },
});
