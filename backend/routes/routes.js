import express from "express";
import { AdminLogin } from "../controllers/AdminLogin.js";
import { getAllServiceTypes, getServiceTypeById } from "../controllers/ServiceTypeListController.js";
import { createServiceType, serviceTypeUpload, getServiceTypeImage } from "../controllers/ServiceTypeCreateController.js";
import { updateServiceType } from "../controllers/ServiceTypeEditController.js";
import { deleteServiceType, bulkDeleteServiceTypes } from "../controllers/ServiceTypeDeleteController.js";
import { createGalleryItem, galleryUploadMiddleware, listGalleryItems, getGalleryImage, deleteGalleryItem, updateGalleryItem, createGalleryItemsBulk, galleryUploadMultipleMiddleware } from "../controllers/GalleryController.js";
import { centerUpload, createCenter, listCenters, getCenterImage, deleteCenter } from "../controllers/CentersController.js";
import { centerGalleryUpload, centerGalleryUploadMultiple, createCenterGalleryItem, listCenterGallery, getCenterGalleryImage, deleteCenterGalleryItem } from "../controllers/CenterGalleryController.js";
import { 
  createTestimonial, 
  getAllTestimonials, 
  getTestimonialImage, 
  updateTestimonial, 
  deleteTestimonial 
} from "../controllers/TestimonialController.js";
import { 
  createAnnouncement, 
  getAllAnnouncements, 
  getAnnouncementById, 
  updateAnnouncement, 
  deleteAnnouncement,
  getAnnouncementImage
} from "../controllers/AnnouncementController.js";

import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
} from "../controllers/TeamController.js";

import testimonialUpload from "../middleware/testimonialUpload.js";
import teamUpload from "../middleware/teamUpload.js";

const router = express.Router();

// Admin login route
router.post("/admin/login", AdminLogin);

// Service Types routes - LIST operations
router.get("/service-types", getAllServiceTypes);
router.get("/service-types/:id/image", getServiceTypeImage);
router.get("/service-types/:id", getServiceTypeById);

// Service Types routes - CREATE operations
router.post("/service-types", serviceTypeUpload.single('image'), createServiceType);

// Service Types routes - EDIT operations
router.put("/service-types/:id", serviceTypeUpload.single('image'), updateServiceType);

// Service Types routes - DELETE operations
router.delete("/service-types/:id", deleteServiceType);
router.delete("/service-types/bulk", bulkDeleteServiceTypes);

// Gallery routes (multipart)
router.get("/gallery", listGalleryItems);
router.get("/gallery/:id/image", getGalleryImage);
router.post("/gallery", galleryUploadMiddleware, createGalleryItem);
router.put("/gallery/:id", galleryUploadMiddleware, updateGalleryItem);
router.delete("/gallery/:id", deleteGalleryItem);
// Bulk gallery upload
router.post("/gallery/bulk", galleryUploadMultipleMiddleware, createGalleryItemsBulk);

// Centers
router.get("/centers", listCenters);
router.get("/centers/:id/image", getCenterImage);
router.post("/centers", centerUpload.single('image'), createCenter);
router.delete("/centers/:id", deleteCenter);

// Center gallery
router.get("/center-galleries", listCenterGallery);
router.get("/center-galleries/:id/image", getCenterGalleryImage);
router.post("/center-galleries", centerGalleryUploadMultiple.array('images', 20), createCenterGalleryItem);
router.delete("/center-galleries/:id", deleteCenterGalleryItem);

// Testimonials
router.get("/testimonials", getAllTestimonials);
router.get("/testimonials/:id/image", getTestimonialImage);
router.post("/testimonials", testimonialUpload.single('image'), createTestimonial);
router.put("/testimonials/:id", testimonialUpload.single('image'), updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

// Announcements
router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:id", getAnnouncementById);
router.get("/announcements/:id/image", getAnnouncementImage);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

// Team Members
router.get("/team-members", getAllTeamMembers);
router.get("/team-members/:id", getTeamMemberById);
router.post("/team-members", teamUpload.single('image'), createTeamMember);
router.put("/team-members/:id", teamUpload.single('image'), updateTeamMember);
router.delete("/team-members/:id", deleteTeamMember);

export default router;
