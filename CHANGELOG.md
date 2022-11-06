# Changelog
All notable changes to this project will be documented in this file.

## [0.3.0] - 2022-11-06

Hooks, log request method, improvements and bug fixes.

### Added

- Added Pre- and Post-Block-Hooks, which makes it possible, for example, to have your own whitelist rules or notifications.
- Log request method
- Validate ip addresses in cidr notation before adding to search crawler whitelist
- Example of how to send notifications when a request is blocked
- Bug fix: Remove unicode character "Zero Width Space" (200B) from bing ip adresses

### Changed

- Bug fix: replace quotation marks in logs (user agent and url)
- Remove `googleusercontent.com` from trusted urls for fake search crawler detection
- Remove `Not` and `Petalbot` from bad bot list

## [0.2.0] - 2022-10-23

The second beta release.

### Added

- Fake search crawlers module: Blocks crawlers pretending to be a bot from major search engines or internet companies
- Modules can now have a check method with callback
- Added Security.md

### Changed

- UptimeRobot and archive.org are not longer blocked
- Remove quotation marks in url or useragent when logging
- README.md updates

## [0.1.0] - 2022-10-03

This is the initial beta release.