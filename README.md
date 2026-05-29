This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase & SaaS Production Setup

This application has been upgraded with Firebase Auth, Cloud Firestore subscription state synchronization, and a Stripe payment gateway.

### 1. Firebase Project Setup

1. Create a Firebase Project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** and **Google** authentication providers under *Authentication > Sign-in method*.
3. Enable **Cloud Firestore** and configure the database location.
4. Go to *Project Settings > Service Accounts*, click **Generate new private key**, and extract the project details.
5. Under *Authentication > Settings > Authorized domains*, click **Add Domain** and authorize your deployment domains:
   - `sortingsource.com`
   - `www.sortingsource.com`
   - `sorting-source-bl8rmmdzp-rongdesigns-projects.vercel.app` (or any custom Vercel preview domain)

### 2. Environment Variables (.env.local)

Add the following variables to your local `.env.local` configuration file:

```env
# Firebase Client SDK Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Server SDK Configuration (Private)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe configurations (webhook & secrets)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Firestore Collection Rules

Configure Firestore security rules to allow users read-only access to their own billing profile, while blocking them from writing to the `subscriptionStatus` field directly (this is managed by the serverless webhook):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow read access for authenticated users to their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      // Allow user creation (signup) but restrict updates to non-billing fields
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId 
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['subscriptionStatus', 'stripeCustomerId', 'stripeSubscriptionId']);
    }
  }
}
```

### 4. Running the Complete Infrastructure

To start both the Next.js development server and the background Python engine concurrently, open two terminal windows:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Python Engine):**
1. Install Python requirements: `pip install -r requirements.txt`
2. Start the FastAPI server: `python main.py`
```
