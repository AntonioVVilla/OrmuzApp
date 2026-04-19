---
layout: null
title: Privacy policy — OrmuzApp
permalink: /privacy/en/
---

# OrmuzApp privacy policy

_Last updated: April 19, 2026_

This policy describes how the **OrmuzApp** application ("the app",
"we") handles information when you use it. The app is published by
**Gestur Canarias** (contact: <soporte@gesturcanarias.es>) and is
free software with no advertising, no user accounts and no
third-party tracking.

OrmuzApp is a local query client for the public fuel-price catalogue
in Spain, served by the Ministry of Industry, Commerce and Tourism
(<https://geoportalgasolineras.es>).

---

## 1. Data we collect

### 1.1. Precise location (`ACCESS_FINE_LOCATION`)

- **Why** — To compute locally which Spanish province you are in and
  how far each fuel station is from your current position, and to
  centre the map on your location.
- **When** — Only while the app is open and in the foreground. We do
  not access your location in the background.
- **How it's stored** — The current coordinate stays only in memory
  while you use the app. It is not persisted to disk, not sent to
  any server of ours, and not synced across devices.
- **Who receives it** — Nobody. The proximity calculation happens
  entirely on-device.

If you deny the permission, the app still works showing the stations
in Madrid by default; no functionality is lost beyond automatic
centring on your position.

### 1.2. Local usage preferences

The app saves a small cache in device storage so it can work without
a network connection:

- The latest list of stations fetched per province (id, name,
  address, prices, opening hours).
- The fuel type you last selected.
- The search radius you last picked.

These are stored with React Native's `AsyncStorage`, are wiped when
you uninstall the app, and **never leave the device**.

### 1.3. What we do NOT collect

- No analytics (no Firebase Analytics, no Google Analytics,
  no Mixpanel, etc.).
- No ads and no advertising SDKs.
- We do not ask for email, password, name or any personal data.
- We do not record your query history.
- We do not perform cross-app tracking or associate any advertising
  identifier.

---

## 2. Network connections

The app only makes HTTPS requests to two domains:

1. **`sedeaplicaciones.minetur.gob.es`** — The official public API
   of the Spanish Ministry of Industry, Commerce and Tourism; the
   source of fuel prices and station locations.

2. **`tiles.openfreemap.org`** — The
   [OpenFreeMap](https://openfreemap.org/) tile server for the map
   background, built on
   [OpenStreetMap](https://www.openstreetmap.org/) data.

We do not send your location nor any personal data to either
service. The requests are anonymous: the server only sees the IP
address the connection originates from, like any other web request
made from your device.

OpenStreetMap data is distributed under the
[Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
The required attribution ("© OpenStreetMap contributors") is shown
inside the app on the map screen itself.

---

## 3. Exercising your rights

Because we do not collect personally identifiable data, there is no
user profile to view, correct, export or delete. The only data tied
to you is stored locally on your device, which you can remove at any
time:

- **Clear the cache**: System Settings → Apps → OrmuzApp → Storage →
  "Clear data".
- **Revoke the location permission**: System Settings → Apps →
  OrmuzApp → Permissions → Location → "Don't allow".
- **Uninstall the app**: removes all local data.

If you still want to contact us about this policy or about the EU
GDPR, write to <soporte@gesturcanarias.es>. We respond within 30
calendar days.

---

## 4. Children

The app is not directed at children under 13 years old, but since it
does not collect any data that could identify the user, usage by a
minor does not involve processing of personal data.

---

## 5. Changes to this policy

If we update this policy we will publish the new version at this
same URL with a visible "Last updated" date. Material changes will
also be noted in the app's changelog.

---

## 6. Applicable law

- Regulation (EU) 2016/679 (GDPR).
- Spanish Organic Law 3/2018 on Personal Data Protection and the
  Safeguarding of Digital Rights (LOPDGDD).

Competent supervisory authority: Spanish Data Protection Agency
(<https://www.aepd.es>).

---

## 7. Contact

- **Data controller**: Gestur Canarias
- **Email**: <soporte@gesturcanarias.es>
- **Source code**: <https://github.com/AntonioVVilla/OrmuzApp>
- **Vulnerability disclosure**: see [`SECURITY.md`](https://github.com/AntonioVVilla/OrmuzApp/blob/master/SECURITY.md)
