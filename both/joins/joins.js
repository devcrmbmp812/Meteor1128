// IndustrySubSector
IndustrySubSector.join(Industry, "industry", "parent", []);
// Listing
Listing.join(ConsultantType, "consultant_type", "consultant_type_doc", []);
Listing.join(ProjectValue, "project_value", "project_value_doc", []);
Listing.join(Industry, "industry", "industry_doc", []);
Listing.join(IndustrySubSector, "industry_sub_sector", "industry_sub_sector_doc", []);
Listing.join(ProjectTeamLocation, "project_team_location", "project_team_location_doc", []);
Listing.join(CommencementDate, "commencement_date", "commencement_date_doc", []);
Listing.join(Files.files, "images", "file");
