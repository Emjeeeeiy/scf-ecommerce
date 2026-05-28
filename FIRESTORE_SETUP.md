# Firestore Setup

This app now expects Firebase Auth and Firestore collections that mirror the ecommerce plan:

- `users/{uid}`
- `users/{uid}/addresses/{addressId}`
- `categories/{categoryId}`
- `products/{productId}` with `base64Image` stored directly on the product document
- `products/{productId}/variants/{variantId}`
- `carts/{uid}`
- `carts/{uid}/items/{variantId}`
- `orders/{orderId}`
- `orders/{orderId}/items/{orderItemId}`

## Recommended Security Rules

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() 
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read, create: if isOwner(userId) || isAdmin();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();

      match /addresses/{addressId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    match /guests/{guestId} {
      allow create: if true;
      allow read, delete: if isAdmin();
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();

      match /variants/{variantId} {
        allow read: if true;
        allow write: if isAdmin();
      }
    }

    match /carts/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();

      match /items/{itemId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    match /orders/{orderId} {
      allow create: if true; 
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow update, delete: if isAdmin();

      match /items/{itemId} {
        allow create: if true;
        allow read: if isAdmin() || (isSignedIn() && get(/databases/$(database)/documents/orders/$(orderId)).data.userId == request.auth.uid);
        allow update, delete: if isAdmin();
      }
    }

    match /settings/{settingsId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## Admin Bootstrap

The app automatically creates a Firestore profile document after login or registration. To make an account an admin, update `users/{uid}.role` to `admin` in Firestore.

## Demo Data

The catalog view seeds a small demo catalog when `categories` is empty so the storefront is usable immediately.

## Base64 Product Images

Product images are stored as base64 data URLs in the `products` collection. This keeps the project on Firestore-only storage, but it also means large images will increase document size quickly. Prefer compressed images and smaller dimensions before uploading.
