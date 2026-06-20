const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.onNewOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const orderData = snapshot.data();
  const customerDetails = orderData.customerDetails || {};
  const customerName = customerDetails.firstName && customerDetails.lastName 
    ? `${customerDetails.firstName} ${customerDetails.lastName}` 
    : "Guest";
  const totalAmount = orderData.totalAmount || 0;

  console.log(`New order created: ${event.params.orderId} by ${customerName}`);

  try {
    // 1. Fetch all admin users' FCM tokens
    const db = admin.firestore();
    const usersSnapshot = await db.collection("users")
      .where("role", "==", "admin")
      .get();

    const tokens = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.fcmTokens && Array.isArray(userData.fcmTokens)) {
        tokens.push(...userData.fcmTokens);
      }
    });

    if (tokens.length === 0) {
      console.log("No admin FCM tokens found.");
      return;
    }

    // Remove duplicates
    const uniqueTokens = [...new Set(tokens)];

    console.log(`Sending notifications to ${uniqueTokens.length} admin tokens.`);

    // 2. Build the notification payload
    const message = {
      notification: {
        title: "New Order Received! 🛒",
        body: `${customerName} ordered items totaling ₱${totalAmount.toLocaleString()}`,
      },
      data: {
        orderId: event.params.orderId,
        click_action: "/admin/orders",
      },
      tokens: uniqueTokens,
    };

    // 3. Send notification
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} messages. Failed: ${response.failureCount}`);

    // Optional: Clean up failed tokens
    if (response.failureCount > 0) {
      const tokensToRemove = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            tokensToRemove.push(uniqueTokens[idx]);
          }
        }
      });

      if (tokensToRemove.length > 0) {
        console.log(`Cleaning up ${tokensToRemove.length} inactive tokens...`);
        const batch = db.batch();
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.fcmTokens && Array.isArray(userData.fcmTokens)) {
            const updatedTokens = userData.fcmTokens.filter(t => !tokensToRemove.includes(t));
            if (updatedTokens.length !== userData.fcmTokens.length) {
              batch.update(doc.ref, { fcmTokens: updatedTokens });
            }
          }
        });
        await batch.commit();
        console.log("Inactive tokens cleaned up.");
      }
    }
  } catch (error) {
    console.error("Error sending push notifications:", error);
  }
});
