

# OPay Clone — Full-Featured Nigerian Fintech Demo

## Overview
A mobile-first PWA that replicates OPay's look and feel with OPay's green (#00B140) color scheme, real logo, bottom navigation, and all simulated financial features. Powered by Supabase for auth, database, and real-time updates.

---

## 1. Authentication
- **Sign-up / Login** with email + password via Supabase Auth
- **Simulated OTP screen** — user enters any 4-digit code and it "verifies"
- Auto-create a user profile and wallet (starting balance ₦0.00) on sign-up
- Simulated 4-digit transaction PIN setup

## 2. Dashboard / Home Screen
- OPay logo at top, greeting with user's name
- **Wallet balance card** — prominent green card showing current balance (tap to hide/show)
- **Quick action grid**: Add Money, Transfer, Pay Bills, Buy Airtime, Savings, Loans — each with icons
- **Recent transactions** — last 5 entries with "See All" link
- Real-time balance updates via Supabase subscriptions

## 3. Add Money / Fund Wallet
- Simple form: amount input (₦100 minimum), optional note
- On submit: instantly credit wallet balance in Supabase
- Success screen with green checkmark animation and amount confirmation
- Transaction logged as "Credit" in history

## 4. Transfer Money
- **Bank selection** dropdown with 25+ major Nigerian banks (hardcoded list with bank codes)
- **10-digit account number** input with validation
- **Simulated account name resolution** — on entering full account number, display a randomly generated realistic Nigerian name (from a curated list of ~50 names)
- Amount input, narration field, and 4-digit PIN confirmation
- Confirmation screen: "Sending ₦X to [Name] at [Bank]?"
- On confirm: deduct from balance (with insufficient funds check), log transaction, show success receipt

## 5. Transaction History
- Full chronological list of all transactions (credits & debits)
- Each entry shows: date/time, type (Credit/Debit), description, amount, status badge
- Tap any transaction → detailed receipt view with:
  - Reference number (e.g., OPY-XXXXXX)
  - Sender/recipient info, bank, amount, narration, timestamp
  - "Share Receipt" button (copies text to clipboard)

## 6. Pay Bills
- Category selection: Electricity, Cable TV, Internet, Water
- Provider dropdown per category (e.g., IKEDC, DSTV, Spectranet)
- Input fields: meter/smart card number, amount
- Simulated payment: deduct balance, show success + receipt

## 7. Buy Airtime / Data
- Network selection: MTN, Glo, Airtel, 9mobile
- Phone number input (11 digits), amount selection (preset buttons + custom)
- Deduct from balance, success screen

## 8. Savings
- Create savings goals: name, target amount, optional deadline
- Fund goals from wallet balance
- Progress bar showing percentage toward target
- Withdraw back to wallet

## 9. Profile / Settings
- View profile: name, email, phone
- Edit profile details
- Change transaction PIN (simulated)
- App preferences

## 10. Notifications
- In-app notification bell with badge count
- Auto-generated alerts for every transaction (credit, debit, bill payment)
- Mark as read functionality

## 11. Bottom Navigation Bar
- Fixed bottom nav with icons: **Home**, **Transfer**, **Bills**, **History**, **Me**
- Active state highlighting in OPay green

## Design & UX
- Mobile-first responsive layout (max-width container for desktop)
- OPay's real logo used throughout
- Green (#00B140) primary color, white backgrounds, rounded cards, bold modern typography
- Loading spinners, error toasts (insufficient balance, invalid input), success animations
- PWA manifest for installability on phones

## Backend (Supabase)
- **Tables**: profiles, wallets, transactions, savings_goals, notifications
- **Row Level Security** on all tables (users access only their own data)
- **Real-time subscriptions** for wallet balance and transactions
- **Database triggers** to auto-create wallet and profile on user signup

