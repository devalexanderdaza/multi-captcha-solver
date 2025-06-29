# [1.4.0](https://github.com/devalexanderdaza/multi-captcha-solver/compare/v1.3.0...v1.4.0) (2025-06-29)


### Features

* Add automatic captcha detection functionality ([6148af9](https://github.com/devalexanderdaza/multi-captcha-solver/commit/6148af9b63c72b80be8d0991f4dd63aebe5cbaf0))
* Add comprehensive End-to-End tests for captcha detection and resolution with service integration ([def412c](https://github.com/devalexanderdaza/multi-captcha-solver/commit/def412c9440981bee1cc7691ed83769b345f5258))
* Add integration testing framework with environment variable checks and comprehensive test cases for captcha services ([04096fd](https://github.com/devalexanderdaza/multi-captcha-solver/commit/04096fdb6377b0acd89dcaeb2637d0078378fa16))
* Implement retry logic with customizable error handling in withRetries function ([a2b6522](https://github.com/devalexanderdaza/multi-captcha-solver/commit/a2b6522434bc992a3241a346f20fca2c4b628057))
* Implemented support for new provider CapMonster Cloud. ([cc735f0](https://github.com/devalexanderdaza/multi-captcha-solver/commit/cc735f0360462f748d53b92bb19d13dbe990f6a3))
* Update Jest configuration for improved test handling and coverage reporting ([1a6b2e1](https://github.com/devalexanderdaza/multi-captcha-solver/commit/1a6b2e1031a520a125b1ad5eea07de6970e9dd33))

# [1.3.0](https://github.com/devalexanderdaza/multi-captcha-solver/compare/v1.2.1...v1.3.0) (2025-06-19)

### Features

- Add example usage for MultiCaptchaSolver with proxy support and update ESLint ignore rules ([0e4bbf6](https://github.com/devalexanderdaza/multi-captcha-solver/commit/0e4bbf6d7da4833c670674c35dff353dd0d62316))
- Add proxy options handling and tests for MultiCaptchaSolver, including retries configuration ([5af2188](https://github.com/devalexanderdaza/multi-captcha-solver/commit/5af21883895b65aa0146516d2124fa42e706fc64))
- Add proxy support to MultiCaptchaSolver and related services for enhanced captcha solving capabilities ([d0bdd93](https://github.com/devalexanderdaza/multi-captcha-solver/commit/d0bdd93a73faeb0a9e8bd0fbedc9e471c90f075f))
- Add support for hCaptcha and reCAPTCHA v3 in MultiCaptchaSolver with corresponding methods in AntiCaptchaService and TwoCaptchaService ([8100023](https://github.com/devalexanderdaza/multi-captcha-solver/commit/8100023064f81c650f54dc702a111c38d60f3ab4))
- Implement solveHCaptcha and solveRecaptchaV3 methods in MultiCaptchaSolver and corresponding tests in service spec files ([5a8ac84](https://github.com/devalexanderdaza/multi-captcha-solver/commit/5a8ac84ab44a1c94eb1dba8cea182108d77a9d65))
- Implement solveRecaptchaV2 method in AntiCaptchaService and TwoCaptchaService with corresponding tests ([70787e0](https://github.com/devalexanderdaza/multi-captcha-solver/commit/70787e025d61905790826c7ae2fb072eda5fe03b))
- Implement withRetries utility function and integrate it into MultiCaptchaSolver methods for improved error handling and retry logic ([03d69c8](https://github.com/devalexanderdaza/multi-captcha-solver/commit/03d69c8ec6bbae70f5101af381d77f068b0d4c54))
- Update documentation for IMultiCaptchaSolverOptions and ProxyOptions interfaces ([80dba9a](https://github.com/devalexanderdaza/multi-captcha-solver/commit/80dba9ad2b9aaae72a5cd1842d57edbc997d16e7))

## [1.2.1](https://github.com/devalexanderdaza/multi-captcha-solver/compare/v1.2.0...v1.2.1) (2025-06-18)

### Bug Fixes

- Add step to copy essential files to build directory for NPM package ([2d4ffc6](https://github.com/devalexanderdaza/multi-captcha-solver/commit/2d4ffc66d5e74798a6e246aa7ed488874520d08f))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/en/1.0.0/).

## [Unreleased]

## [1.0.0] - YYYY-MM-DD

### Added

- New feature or significant improvement.

### Changed

- Notable change in existing functionality.

### Removed

- Removed functionality or deprecated features.

[Unreleased]: https://github.com/devalexanderdaza/multi-captcha-solver/compare/HEAD...main
[1.0.0]: https://github.com/devalexanderdaza/multi-captcha-solver/releases/tag/1.0.0
