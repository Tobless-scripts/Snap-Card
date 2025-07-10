# 📇 SnapCard

SnapCard lets users instantly **create**, **share**, and **scan** professional digital contact cards (vCards) using QR codes — all in a sleek and modern web experience.

---

## 🚀 Features

-   ⚡️ **Instant QR Code Generator**  
    Automatically generate a shareable QR code for your digital contact card.

-   📱 **vCard Format Support**  
    SnapCard uses the universal `.vcf` format so users can add contacts directly to their phonebook.

-   🔍 **Smart QR Scanner**  
    Scan QR codes from other users and open their contact cards immediately in your phone’s contacts app.

-   🧾 **User Profiles**  
    Users can create and customize their profile with name, title, email, phone number, job, and more.

-   🛠️ **Offline-First Experience**  
    SnapCard is a **PWA** (Progressive Web App) with offline support.  
    Users can access saved contact cards and scan QR codes even without internet.

    > 🔁 **Note**: Internet is required only when updating or syncing profile data.

-   🔐 **Authentication with Firebase**  
    Sign up, sign in, and manage your profile securely using Firebase Auth.

-   🌐 **Responsive UI**  
    Built with **Next.js**, **Tailwind CSS**, and **modern design principles** — optimized for both mobile and desktop.

---

## 🌍 Live Demo

[👉 Visit SnapCard (Live URL)] (https://snap-card-one.vercel.app/)

---

## 🧱 Tech Stack

| Tech         | Use                      |
| ------------ | ------------------------ |
| Next.js      | App Framework            |
| React        | Frontend Logic           |
| Tailwind CSS | Styling                  |
| Firebase     | Auth, Firestore DB       |
| PWA          | Offline Support          |
| QR Code Lib  | QR Generation & Scanning |
| HTML5-QRCode | In-browser QR scanning   |

---

## 🧪 How It Works

1. **User signs up or logs in** via Firebase Authentication.
2. **Profile is created or fetched** from Firestore.
3. A **vCard (.vcf)** is generated and converted into a **QR code**.
4. **Others scan your QR** to instantly get your contact and add it to their phone.
5. **Offline mode** caches your card and scan page for fast access.
6. To **update your profile**, internet access is required.

---

## 📦 Installation

```bash
# Clone the repo
https://github.com/Tobless-scripts/Snap-Card.git

# Go to the project folder
cd snapcard

# Install dependencies
npm install

# Start the development server
npm run dev
```
