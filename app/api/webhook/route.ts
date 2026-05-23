import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import admin from "firebase-admin";

function getFirestoreDb() {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey ? privateKey.replace(/\\n/g, "\n") : undefined,
      }),
    });
  }
  return admin.firestore();
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
  });
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error("Missing Webhook Secret");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    const db = getFirestoreDb();
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.client_reference_id;
        
        if (userId) {
          await db.collection("users").doc(userId).set({
            stripeCustomerId: checkoutSession.customer as string || null,
            stripeSubscriptionId: checkoutSession.subscription as string || null,
            subscriptionStatus: "active",
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`>>> [WEBHOOK] Subscription activated for user: ${userId}`);
        } else {
          console.warn(">>> [WEBHOOK] No client_reference_id (userId) found in checkout session.");
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(">>> [WEBHOOK] Payment succeeded for invoice:", invoice.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const snapshot = await db.collection("users").where("stripeSubscriptionId", "==", subscription.id).limit(1).get();
        
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.set({
            subscriptionStatus: "inactive",
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`>>> [WEBHOOK] Subscription deleted. Deactivated user: ${userDoc.id}`);
        } else {
          console.warn(`>>> [WEBHOOK] No user found with subscription ID: ${subscription.id}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const snapshot = await db.collection("users").where("stripeSubscriptionId", "==", subscription.id).limit(1).get();
        
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const status = subscription.status === "active" ? "active" : "inactive";
          await userDoc.ref.set({
            subscriptionStatus: status,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`>>> [WEBHOOK] Subscription updated to ${status} for user: ${userDoc.id}`);
        } else {
          console.warn(`>>> [WEBHOOK] No user found with subscription ID: ${subscription.id}`);
        }
        break;
      }

      default:
        console.log(`>>> [WEBHOOK] Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error(">>> [WEBHOOK] Firestore sync error:", err);
    return NextResponse.json({ error: "Failed to sync database state" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
