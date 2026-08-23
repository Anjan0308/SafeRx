# Person 4 — Pharmacist-Facing Mobile App

## 📱 Role

**Pharmacist-Facing Mobile App Lead**

This module provides a simple mobile application for pharmacists to capture prescriptions, verify extracted medicine information, and receive clear drug-interaction alerts.

The main goal is to make the pharmacist's workflow:

**Capture → Confirm → Check → Alert**

The application should remain simple and easy to use, especially when the pharmacist is working under time pressure or has limited internet connectivity.

---

## 🎯 Mission

Build a pharmacist-friendly mobile application that allows users to:

1. Capture a prescription using the device camera.
2. View the medicines extracted by OCR.
3. Correct OCR results manually when required.
4. Submit the prescription for interaction checking.
5. View potentially dangerous drug interactions.
6. Understand the severity and reason for an alert.
7. Continue using the application when internet connectivity is unavailable.

The project plan specifically emphasizes a simple workflow and plain-language alerts for non-technical users.

---

## ✨ Main Features

### 1. 📷 Prescription Capture

The pharmacist can capture a prescription using the mobile camera.

Features:

- Open device camera.
- Capture prescription image.
- Preview the image.
- Retake the image if necessary.
- Send the image to the OCR module.

---

### 2. 🔍 OCR Result Confirmation

After OCR processing, the extracted information is displayed to the pharmacist.

Example:

```text
Medicine: Amoxicillin
Dosage: 500mg
Prescriber: Dr. R. Shah
```

The pharmacist should be able to manually edit the extracted information before submitting it.

This is important because handwritten prescriptions may not always be recognized correctly.

---

### 3. ✏️ Manual Correction

If OCR produces an incorrect or low-confidence result, the pharmacist can correct:

- Medicine name
- Dosage
- Other extracted prescription fields

The manual correction functionality is considered a core safety feature rather than an optional feature.

---

## 🚨 4. Drug Interaction Alert

After the prescription is confirmed, the application sends the information to the backend.

The backend checks the new medicines against the patient's existing medication history.

The mobile application then displays the result.

Example:

```text
⚠ HIGH-RISK INTERACTION

Warfarin + Aspirin

Potentially dangerous interaction detected.

Do not dispense together without appropriate
professional review.
```

The alert should use:

- Clear severity indication
- Large readable text
- Simple language
- Minimal medical jargon
- Obvious next action

The project plan recommends severity-based visual alerts and plain-language explanations.

---

## 📴 5. Offline Mode

The application must handle situations where there is no internet connection.

When offline:

```text
No Internet Connection

Prescription saved locally.

It will be checked when the connection
is restored.
```

The application should not crash or leave the pharmacist uncertain about what happened.

The project uses an offline-first approach where requests can be queued locally and synchronized when connectivity returns.

---

# 📱 Application Flow

```text
┌─────────────────────┐
│  Capture Prescription│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     OCR Processing   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Confirm / Correct    │
│ Medicine Information │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Interaction Check   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Alert Result      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│       History        │
└─────────────────────┘
```

The planned core application flow consists of four main screens: **Capture → Confirm/Correct → Alert Result → History**.

---

# 🖥️ Screens

## 1. Capture Screen

Purpose:

- Open camera.
- Capture prescription.
- Preview image.
- Retake image.

Example:

```text
--------------------------------
       Prescription Guard

       [ Camera Preview ]

          📷 Capture

       [ Retake ]
--------------------------------
```

---

## 2. Confirm / Correct Screen

Purpose:

Display OCR results and allow the pharmacist to make corrections.

Example:

```text
--------------------------------
      Confirm Prescription

Medicine:
[ Amoxicillin             ]

Dosage:
[ 500mg                   ]

Prescriber:
[ Dr. R. Shah             ]

     [ Edit ]   [ Continue ]
--------------------------------
```

---

## 3. Alert Result Screen

Purpose:

Show the interaction result clearly.

Example:

```text
--------------------------------
        ⚠ HIGH RISK

     Warfarin + Aspirin

Potential interaction detected.

Risk:
Bleeding

Please review before dispensing.

          [ Done ]
--------------------------------
```

Severity should be immediately understandable through visual indicators such as color and icons, rather than relying only on text.

---

## 4. History Screen

Purpose:

Allow the pharmacist to see previous prescription checks.

The history screen is not the primary judged feature, so it should remain simple and should not consume excessive development time.

---

# 🛠️ Technology

The project plan proposes:

**Mobile Application**

- React Native **or** Flutter
- Device Camera
- Local SQLite storage
- REST API integration

The shared project technology stack identifies React Native/Flutter for the pharmacist application and SQLite for local-first storage.

---

# 🔌 Backend Integration

The mobile application communicates with the backend APIs.

Important endpoints include:

```text
POST /api/patients
GET  /api/patients/:id/history
POST /api/prescriptions
GET  /api/prescriptions/:id/result
POST /api/auth/login
```

The backend is responsible for storing prescriptions, retrieving patient history, running the interaction check, and returning the result.

The mobile app consumes these results rather than directly calling the interaction engine.

---

# 🔗 Team Dependencies

Person 4 depends primarily on:

### Person 1 — OCR & Prescription Capture

Provides:

```json
{
  "confidence": 0.82,
  "medicines": [
    {
      "raw_text": "Amoxicillin 500mg",
      "name": "Amoxicillin",
      "dosage": "500mg",
      "matched": true
    }
  ],
  "prescriber": "Dr. R. Shah",
  "needs_review": false
}
```

### Person 3 — Backend

Provides the APIs required to:

- Retrieve patient history.
- Submit prescriptions.
- Receive interaction results.
- Synchronize offline data.

The project plan specifically identifies Person 4's dependencies on Person 1 and Person 3.

---

# ⏱️ Development Plan

## Hours 0–3 — UI Flow

Create the four main screens:

```text
Capture
   ↓
Confirm / Correct
   ↓
Alert Result
   ↓
History
```

---

## Hours 3–5 — API Contract

Coordinate with Person 1 and Person 3.

Start development using mocked JSON responses instead of waiting for the complete backend/OCR implementation.

This allows the mobile application to be developed in parallel.

---

## Hours 5–10 — Capture + Confirmation

Implement:

- Camera integration.
- Prescription preview.
- OCR result display.
- Editable medicine fields.
- Manual correction.

---

## Hours 10–15 — Alert Screen

Implement:

- Interaction result display.
- Severity indicators.
- Plain-language explanations.
- Clear warning messages.

---

## Hours 15–18 — Offline Support

Implement:

- Offline detection.
- Local request queue.
- "Saved offline" state.
- Synchronization after reconnection.

---

## Hours 18–26 — Integration

Replace mock responses with the actual:

```text
OCR Module
     ↓
Backend API
     ↓
Interaction Engine
     ↓
Mobile Application
```

Test the complete workflow end-to-end.

---

## Hours 26–32 — Polish & Testing

Focus on:

- Loading states.
- Error states.
- Empty states.
- Accessibility.
- Font size.
- Contrast.
- Touch-friendly controls.

---

# 🧪 Testing Checklist

### Camera

- [ ] Camera works on a real Android device.
- [ ] Prescription can be captured.
- [ ] Image preview works.
- [ ] Retake functionality works.

### OCR

- [ ] OCR results are displayed correctly.
- [ ] Medicine names can be edited.
- [ ] Dosage can be edited.
- [ ] Manual correction works.

### Interaction Alert

- [ ] Interaction result is displayed.
- [ ] Severity is clearly visible.
- [ ] Explanation is understandable.
- [ ] High-risk interactions are visually obvious.

### Offline Mode

- [ ] App does not crash without internet.
- [ ] Prescription can be saved locally.
- [ ] Offline status is clearly shown.
- [ ] Data synchronizes after reconnecting.

### End-to-End

- [ ] Capture → OCR → Confirm → Interaction Check → Alert works.
- [ ] Full workflow works on a real device.
- [ ] Backend integration works correctly.

The project's testing checklist specifically requires real-device testing, working manual correction, clear alert severity, and an airplane-mode/offline test.

---

# 🎯 Deliverable

The final deliverable for Person 4 is:

> **A working pharmacist-facing mobile application covering the complete Capture → Confirm → Alert workflow, including offline handling.**

---

# 💡 Design Principles

The application should be designed for a pharmacist who is working quickly at a pharmacy counter.

Therefore:

- Keep the number of taps low.
- Use large buttons.
- Use readable fonts.
- Avoid unnecessary text.
- Avoid complicated medical terminology.
- Make the next action obvious.
- Clearly distinguish high-risk alerts.
- Always provide a recovery path when OCR fails.
- Do not make the user dependent on a constant internet connection.

> **Simple. Fast. Clear. Safe.**

---

# 👤 Person 4 Ownership

Person 4 owns:

```text
📱 Mobile Application
├── Camera Flow
├── Prescription Capture
├── OCR Result Display
├── Manual Correction
├── Interaction Alert UI
├── Offline UX
├── History Screen
└── Mobile Integration Testing
```

The goal is to give pharmacists a **simple, reliable, and easy-to-understand interface for checking prescription safety.**