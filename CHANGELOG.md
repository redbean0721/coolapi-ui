# Changelog

## [2.0.4-dev] - 2025-01-13
### Added
- Completed the content for the `Image.vue` page, turning its basic structure into a fully functional page

### Changed
- Added data type definitions in `MCStatus.vue` to improve clarity and structure.


## [2.0.3-dev] - 2025-01-10
### Changed
- **Minecraft Menu**: Removed the `Minecraft.vue` component and split its functionality into two new components:
  - Added `MCStatus.vue` to handle the Minecraft status page.
  - Added `MCRcon.vue` to handle the Minecraft RCON page.
- **Navigation Bar Update**: Replaced the `Minecraft` `router-link` with a menu containing two sub-options:
  - `Status`: Links to the `/minecraft/status` page.
  - `RCON`: Links to the `/minecraft/rcon` page.
- **Minecraft Menu Toggle**: Implemented automatic expansion or collapse of the Minecraft menu based on the current route.


## [2.0.2-dev] - 2025-01-09
### Added
- Completed the content for the `Image.vue` page, turning its basic structure into a fully functional page

### Changed
- Moved styles from `App.vue` to `style.css`
- Removed the header from `Home.vue`


## [2.0.1-dev] - 2025-01-04
### Added
- Added `changelog.md` to track project changes.
- Added color classifications for announcements in `style.css` (red, yellow, green).
- Renamed `Command.vue` to `Minecraft.vue` for better clarity and consistency.
- Updated `router.js` to reflect the new route name for the Minecraft page.

### Changed
- Enhanced UI design and improved routing logic.
- Improved document title handling to dynamically display route names or default to 'CoolAPI'.
- Updated `Home.vue` layout and made other minor UI adjustments for better presentation.
- Updated `README.md` with project restructuring information and archived project reference.
- Updated `package.json` to reflect version 2.0.1-dev.


## [2.0.0-dev] - 2024-12-29
### Changed
- Integrate external template into project


## [1.0.0] - 2024-12-30
- Initial release.


# CoolAPI

This is the refactored version of the CoolAPI project, where we have restructured the UI and added new features.

## Archived Project

For the archived version of the CoolAPI project, please visit [CoolAPI-Old](https://github.com/redbean0721/CoolAPI-archive).

> Note: This is the previous version of the project, and it is no longer actively maintained.
